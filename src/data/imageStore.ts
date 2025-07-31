import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

import {
	type Collection,
	type GalleryData,
	type GalleryImage,
	type Image,
} from './galleryData.ts';

export class ImageStoreError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ImageStoreError';
	}
}

const defaultGalleryPath = 'src/gallery/gallery.yaml';
export const featuredCollectionId = 'featured';
const builtInCollections = [featuredCollectionId];

interface GetImagesOptions {
	galleryPath?: string;
	collection?: string;
	sortBy?: 'captureDate';
	order?: 'asc' | 'desc';
}

export const getImages = async (options: GetImagesOptions = {}): Promise<Image[]> => {
	const { galleryPath = defaultGalleryPath, collection } = options;
	try {
		let images = (await loadGalleryData(galleryPath)).images;
		images = filterImagesByCollection(collection, images);
		images = sortImages(images, options);
		return processImages(images);
	} catch (error) {
		throw new ImageStoreError(
			`Failed to load images from ${galleryPath}: ${getErrorMsgFrom(error)}`,
		);
	}
};

function getErrorMsgFrom(error: unknown) {
	return error instanceof Error ? error.message : 'Unknown error';
}

const loadGalleryData = async (galleryPath: string): Promise<GalleryData> => {
	try {
		const yamlText = fs.readFileSync(galleryPath, 'utf-8');
		const gallery = yaml.load(yamlText) as GalleryData;
		validateGalleryData(gallery);
		return gallery;
	} catch (error) {
		throw new ImageStoreError(
			`Failed to load gallery data from ${galleryPath}: ${getErrorMsgFrom(error)}`,
		);
	}
};

function filterImagesByCollection(collection: string | undefined, images: GalleryImage[]) {
	if (collection) {
		images = images.filter((image) => image.meta.collections.includes(collection));
	}
	return images;
}

function validateGalleryData(gallery: GalleryData) {
	const collectionIds = gallery.collections.map((col) => col.id).concat(builtInCollections);
	for (const image of gallery.images) {
		const invalidCollections = image.meta.collections.filter((col) => !collectionIds.includes(col));
		if (invalidCollections.length > 0) {
			throw new ImageStoreError(
				`Invalid collection(s) [${invalidCollections.join(', ')}] referenced in image: ${image.path}`,
			);
		}
	}
}

function sortImages(images: GalleryImage[], options: GetImagesOptions) {
	const { sortBy, order } = options;
	let result: GalleryImage[] = images;
	if (sortBy) {
		result.sort((a, b) => {
			const dateA = a.exif?.captureDate?.getTime() || 0;
			const dateB = b.exif?.captureDate?.getTime() || 0;
			return dateA - dateB;
		});
	}
	if (order === 'desc') {
		result.reverse();
	}
	return result;
}

// ✅ Strip leading "/public" so final URLs work
const processImages = (images: GalleryImage[]): Image[] => {
	return images.map((img) => ({
		src: img.path.replace(/^\/public/, ''),
		title: img.meta.title,
		description: img.meta.description,
		collections: img.meta.collections,
	}));
};

export const getCollections = async (
	galleryPath: string = defaultGalleryPath,
): Promise<Collection[]> => {
	return (await loadGalleryData(galleryPath)).collections;
};

