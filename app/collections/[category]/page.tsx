import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Home from '@/app/page';

const names: Record<string, string> = { seating: 'Seating', tables: 'Tables', lighting: 'Lighting', objects: 'Objects' };

export function generateStaticParams() {
    return Object.keys(names).map(category => ({ category }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
    const { category } = await params;
    const name = names[category];
    return name ? { title: `${name} | Forma Studio`, description: `Explore the Forma Studio ${name.toLowerCase()} collection.` } : {};
}

export default async function CollectionPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params;
    const name = names[category];
    if (!name) notFound();
    return <Home categoryPage={name}/>;
}
