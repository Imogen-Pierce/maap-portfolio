import type { ImageMetadata } from 'astro';
import path from 'path';
import { promises as fs } from 'fs';
import * as yaml from 'js-yaml';

/**
 * Structure of the collections YAML file
 */
export interface GalleryData {
    collections: Collection[];
    images: GalleryImage[];
}

export interface Collection {
    id: string;
    name: string;
}

export interface GalleryImage {
    path: string;
    meta: Meta;
    exif?: ImageExif;
}

export interface Meta {
    title: string;
    description: string;
    collections: string[];
}

export interface ImageExif {
    focalLength?: number;
    iso?: number;
    fNumber?: number;
    shutterSpeed?: number;
    captureDate?: Date;
    model?: string;
    lensModel?: string;
}

export interface Image {
    src: ImageMetadata;
    title: string;
    description: string;
    collections: string[];
}

export type ImageModule = { default: ImageMetadata };

/**
 * Loads a gallery YAML file from the filesystem at runtime
 * @param galleryPath Path to the YAML file relative to the project root
 * @returns Parsed gallery data (collections and images)
 */
export const loadGallery = async (galleryPath: string): Promise<GalleryData> => {
    const yamlPath = path.resolve(process.cwd(), galleryPath);
    const content = await fs.readFile(yamlPath, 'utf8');
    const parsed = yaml.load(content);
    if (!parsed || typeof parsed !== 'object' || !('collections' in parsed) || !('images' in parsed)) {
        throw new Error(`Invalid gallery YAML structure in ${galleryPath}`);
    }
    return parsed as GalleryData;
};

export const NullGalleryData: GalleryData = {
    collections: [],
    images: [],
};
