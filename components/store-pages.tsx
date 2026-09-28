"use client";
/* eslint-disable @next/next/no-img-element -- These pages reuse the store's optimized local catalog photography. */

import { useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, GitCompareArrows, X } from 'lucide-react';
import { money, products, type Product } from '@/lib/catalog';

export type ContentPage = 'shop' | 'rooms' | 'about' | 'delivery-returns' | 'care-guide' | 'compare';

const roomEdits = [
    { id: 'living', label: 'The living room', title: 'Room to settle in.', description: 'A generous seat, a grounded table and a few small moments of light. Start with the pieces you reach for every day.', image: '/images/hero.jpg', imageAlt: 'A softly furnished living room in natural tones', productIds: ['sunday', 'form', 'halo', 'still'] },
    { id: 'dining', label: 'The dining space', title: 'Made for one more.', description: 'Gather around warm wood and woven texture. Simple forms leave room for long meals and good conversation.', image: '/images/new-11363678.jpg', imageAlt: 'The Gather dining table in warm wood', productIds: ['gather', 'cove', 'woven', 'curve'] },
    { id: 'reading', label: 'The reading corner', title: 'An hour of your own.', description: 'A soft chair, a place for a cup, and a little light. Everything you need to make the quiet hours count.', image: '/images/lounge.jpg', imageAlt: 'The Pebble lounge chair', productIds: ['pebble', 'kindred', 'lilt', 'ember'] },
] as const;

const careGuides = [
    { id: 'wood', label: 'Wood & cane', title: 'Let the grain live.', description: 'Wood settles into a home over time. A gentle routine keeps its character intact.', steps: ['Dust with a soft, dry cloth, following the grain.', 'Wipe spills promptly and use coasters beneath cups and vases.', 'Keep away from direct heat and long periods of strong sunlight.'], productIds: ['form', 'gather', 'cove'] },
    { id: 'upholstery', label: 'Upholstery', title: 'Softness, kept simple.', description: 'A little regular attention helps woven seats stay inviting.', steps: ['Vacuum gently with an upholstery attachment.', 'Blot spills with a clean cloth; avoid rubbing them into the weave.', 'Test any fabric cleaner on a hidden area first.'], productIds: ['sunday', 'pebble', 'solace'] },
    { id: 'ceramics', label: 'Ceramics & stoneware', title: 'Care for the small things.', description: 'A soft touch is usually all these pieces need.', steps: ['Wipe with a soft, slightly damp cloth, then dry thoroughly.', 'Avoid abrasive pads and harsh cleaners on glazed or matte finishes.', 'Protect delicate surfaces from chips and sudden temperature changes.'], productIds: ['still', 'curve', 'ember'] },
    { id: 'lighting', label: 'Lighting', title: 'Keep the glow.', description: 'Clean shades and fittings with care, especially around electrical parts.', steps: ['Switch off, unplug and let the fitting cool before cleaning.', 'Dust shades with a dry cloth or a soft brush.', 'Follow the fitting’s own instructions for bulbs and electrical care.'], productIds: ['halo', 'lilt', 'orbit'] },
] as const;

function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: React.ReactNode; description: string }) {
    return <header className="editorial-intro section-wrap"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></header>;
}

function ProductLinks({ ids }: { ids: readonly string[] }) {
    return <div className="edit-products">{ids.map(id => {
        const product = products.find(item => item.id === id);
        if (!product) return null;
        return <Link className="edit-product" key={id} href={`/products/${id}`}><img src={product.image} alt="" loading="lazy" style={{ objectPosition: product.position }}/><span><strong>{product.name}</strong><small>{product.category} · {money(product.price)}</small></span><ArrowUpRight size={18} aria-hidden="true"/></Link>;
    })}</div>;
}

function RoomsPage() {
    return <>
        <PageIntro eyebrow="THE ROOM EDITS" title={<>A room to <em>make your own.</em></>} description="Start with a feeling, then find the pieces that bring it home. Three simple edits from the Forma collection."/>
        <nav className="room-index section-wrap" aria-label="Jump to a room">{roomEdits.map(edit => <a href={`#${edit.id}`} key={edit.id}>{edit.label}<ArrowRight size={16}/></a>)}</nav>
        <div className="room-edits section-wrap">{roomEdits.map((edit, index) => <section className={`room-edit ${index % 2 ? 'room-edit-reverse' : ''}`} id={edit.id} key={edit.id}><div className="room-image"><img src={edit.image} alt={edit.imageAlt} loading="lazy"/></div><div className="room-copy"><p className="eyebrow">{edit.label.toUpperCase()}</p><h2>{edit.title}</h2><p>{edit.description}</p><ProductLinks ids={edit.productIds}/></div></section>)}</div>
        <div className="editorial-tail section-wrap"><span>Make the whole home yours.</span><Link href="/shop" className="text-link">Shop all pieces <ArrowUpRight size={18}/></Link></div>
    </>;
}

function AboutPage() {
    return <>
        <PageIntro eyebrow="ABOUT FORMA" title={<>Living well, <em>one piece at a time.</em></>} description="Forma is a furniture store concept shaped around quiet forms, tactile materials and the spaces we return to every day."/>
        <section className="about-feature section-wrap"><img src="/images/hero.jpg" alt="A living room layered with natural textures"/><div><p className="eyebrow">OUR POINT OF VIEW</p><h2>Good design has room for real life.</h2><p>We believe the pieces you live with should feel as good to use as they do to look at. A comfortable curve, the warmth of timber, a lamp that turns an ordinary corner into your favourite place.</p><p>Explore by room or compare pieces side by side to find the right fit for your space.</p><div className="about-actions"><Link className="button button-olive" href="/rooms">Explore room edits <ArrowUpRight size={18}/></Link><Link className="text-link" href="/shop">Shop all pieces <ArrowRight size={17}/></Link></div></div></section>
        <section className="concept-note section-wrap"><p className="eyebrow">A NOTE ABOUT THIS STORE</p><h2>Designed to be explored.</h2><p>Forma is a demonstration storefront. Product names, prices, finishes and dimensions are sample content, and the photographs illustrate the collection. Your bag, saved pieces and comparisons stay in this browser. The checkout takes no payment and places no real order.</p></section>
    </>;
}

function DeliveryPage() {
    return <>
        <PageIntro eyebrow="DELIVERY & RETURNS" title={<>The details, <em>before you decide.</em></>} description="A clear look at the delivery options shown in the Forma demo checkout."/>
        <section className="delivery-layout section-wrap"><div className="delivery-options-page"><article><span>01 / STANDARD</span><h2>To your doorstep.</h2><p>The demo estimates delivery in 2–4 weeks.</p><strong>$45 <small>or complimentary for a bag of $1,000 or more</small></strong></article><article><span>02 / WHITE GLOVE</span><h2>Into your room.</h2><p>The demo describes room delivery with packaging removed.</p><strong>$95 <small>sample delivery charge</small></strong></article></div><aside className="delivery-note"><p className="eyebrow">PLEASE NOTE</p><h2>This is a concept store.</h2><p>No goods are shipped and no payment is collected. Delivery prices and timelines are examples for the shopping experience, not a live service promise.</p><Link href="/shop" className="text-link">Explore the collection <ArrowUpRight size={18}/></Link></aside></section>
        <section className="help-questions section-wrap"><p className="eyebrow">GOOD TO KNOW</p><h2>Common questions.</h2><details><summary>Can I place a real order?<span>+</span></summary><p>No. Checkout is a demo and creates no order or charge.</p></details><details><summary>What is the return policy?<span>+</span></summary><p>There are no real purchases to return through this concept store. Return terms would need to be published before any live commercial launch.</p></details><details><summary>Are delivery dates guaranteed?<span>+</span></summary><p>No. The 2–4 week estimate is sample content used to demonstrate the shopping flow.</p></details></section>
    </>;
}

function CarePage() {
    const [active, setActive] = useState<(typeof careGuides)[number]['id']>('wood');
    const guide = careGuides.find(item => item.id === active)!;
    return <>
        <PageIntro eyebrow="THE CARE GUIDE" title={<>Keep the good things <em>going.</em></>} description="Simple care ideas for the materials and pieces in the Forma collection. Select a material to see a routine and matching pieces."/>
        <section className="care-layout section-wrap"><div className="care-tabs" aria-label="Choose a material">{careGuides.map(item => <button key={item.id} className={active === item.id ? 'active' : ''} aria-pressed={active === item.id} onClick={() => setActive(item.id)}>{item.label}<ArrowUpRight size={17}/></button>)}</div><div className="care-panel" aria-live="polite"><p className="eyebrow">{guide.label.toUpperCase()}</p><h2>{guide.title}</h2><p>{guide.description}</p><ul>{guide.steps.map(step => <li key={step}><Check size={17} aria-hidden="true"/>{step}</li>)}</ul><h3>Pieces to explore</h3><ProductLinks ids={guide.productIds}/></div></section>
        <p className="care-caveat section-wrap">These are general suggestions. Always follow the care instructions supplied with a real product.</p>
    </>;
}

function ComparePage({ compared, onRemoveCompare }: { compared: Product[]; onRemoveCompare: (id: string) => void }) {
    return <>
        <PageIntro eyebrow="PIECE BY PIECE" title={<>Find the one that <em>fits.</em></>} description="Compare up to three pieces side by side. Use Compare on any product card to build your shortlist."/>
        {compared.length ? <section className="compare-section section-wrap"><div className="compare-heading"><p>{compared.length} of 3 pieces selected</p><Link href="/shop" className="text-link">{compared.length < 3 ? 'Add another piece' : 'Explore the collection'} <ArrowUpRight size={17}/></Link></div><p className="compare-hint">Swipe sideways to see every piece.</p><div className="compare-scroll" role="region" aria-label="Product comparison" tabIndex={0}><table className="compare-table" style={{ '--compare-count': compared.length } as CSSProperties}><thead><tr><th scope="col">The details</th>{compared.map(product => <th scope="col" key={product.id}><button className="compare-remove" onClick={() => onRemoveCompare(product.id)} aria-label={`Remove ${product.name} from comparison`}><X size={18}/></button><Link href={`/products/${product.id}`}><img src={product.image} alt="" style={{ objectPosition: product.position }}/><strong>{product.name}</strong></Link></th>)}</tr></thead><tbody><tr><th scope="row">Price</th>{compared.map(p => <td key={p.id}>{money(p.price)}</td>)}</tr><tr><th scope="row">Category</th>{compared.map(p => <td key={p.id}>{p.category}</td>)}</tr><tr><th scope="row">Materials</th>{compared.map(p => <td key={p.id}>{p.material}</td>)}</tr><tr><th scope="row">Dimensions</th>{compared.map(p => <td key={p.id}>{p.dimensions}</td>)}</tr><tr><th scope="row">Finishes</th>{compared.map(p => <td key={p.id}>{p.finishes.map(f => f.name).join(' · ')}</td>)}</tr><tr><th scope="row">Explore</th>{compared.map(p => <td key={p.id}><Link href={`/products/${p.id}`} className="text-link">View piece <ArrowUpRight size={16}/></Link></td>)}</tr></tbody></table></div></section> : <section className="compare-empty section-wrap"><GitCompareArrows size={35} strokeWidth={1.3}/><h2>Your shortlist starts here.</h2><p>Choose two or three pieces to see their materials, dimensions and prices together.</p><Link href="/shop" className="button button-olive">Explore all pieces <ArrowUpRight size={18}/></Link></section>}
    </>;
}

export function StoreContentPage({ kind, compared, onRemoveCompare }: { kind: Exclude<ContentPage, 'shop'>; compared: Product[]; onRemoveCompare: (id: string) => void }) {
    if (kind === 'rooms') return <RoomsPage/>;
    if (kind === 'about') return <AboutPage/>;
    if (kind === 'delivery-returns') return <DeliveryPage/>;
    if (kind === 'care-guide') return <CarePage/>;
    return <ComparePage compared={compared} onRemoveCompare={onRemoveCompare}/>;
}
