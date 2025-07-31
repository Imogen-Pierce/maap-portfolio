import type { AstroInstance } from 'astro';
import { Github, Instagram } from 'lucide-astro';

export interface SocialLink {
	name: string;
	url: string;
	icon: AstroInstance;
}

export default {
	title: 'M.A.A.P.',
	favicon: 'favicon.ico',
	owner: 'Matt Anderson Aerial Photography',
	profileImage: 'profile.webp',
	socialLinks: [
		{
			name: 'Instagram',
			url: 'https://www.instagram.com/matt_anderson325',
			icon: Instagram,
		} as SocialLink,
	],
};
