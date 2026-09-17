import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Home from '@/app/page';
import { products, money } from '@/lib/catalog';

export function generateStaticParams() {
    return products.map(p => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const product = products.find(p => p.id === id);
    return product ? { title: `${product.name} | Forma Studio`, description: `${product.description} ${money(product.price)}.` } : {};
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!products.some(p => p.id === id)) notFound();
    return <Home productPage={id}/>;
}
