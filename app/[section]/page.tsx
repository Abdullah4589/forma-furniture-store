import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Home from '@/app/page';
import type { ContentPage } from '@/components/store-pages';

const sections: Record<ContentPage, { title: string; description: string }> = {
    shop: { title: 'Shop all pieces', description: 'Explore every piece in the Forma furniture collection.' },
    rooms: { title: 'Room edits', description: 'Explore considered furniture edits for living, dining and reading.' },
    about: { title: 'About Forma', description: 'Meet the ideas behind the Forma furniture store concept.' },
    'delivery-returns': { title: 'Delivery & returns', description: 'Read about the sample delivery options and demo checkout at Forma.' },
    'care-guide': { title: 'Care guide', description: 'Simple care ideas for wood, upholstery, ceramics and lighting.' },
    compare: { title: 'Compare pieces', description: 'Compare Forma furniture materials, dimensions and prices side by side.' },
};

export function generateStaticParams() {
    return Object.keys(sections).map(section => ({ section }));
}

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> {
    const { section } = await params;
    const page = Object.hasOwn(sections, section) ? sections[section as ContentPage] : undefined;
    return page ? { title: `${page.title} | Forma Studio`, description: page.description } : {};
}

export default async function ContentRoute({ params }: { params: Promise<{ section: string }> }) {
    const { section } = await params;
    if (!Object.hasOwn(sections, section)) notFound();
    return <Home key={section} contentPage={section as ContentPage}/>;
}
