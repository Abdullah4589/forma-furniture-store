"use client";
/* eslint-disable @next/next/no-img-element -- Catalog images are optimized local assets with CSS-reserved dimensions; no image service is needed. */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight, ArrowLeft, Search, Heart, ShoppingBag, Menu, Plus, Minus, Trash2, Check, Truck, PackageCheck, X, SlidersHorizontal } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Toaster } from '@/components/ui/sonner';
import { Empty } from '@/components/ui/empty';
import { toast } from 'sonner';
import { products, money, validCart, type Product, type CartLine } from '@/lib/catalog';
import { ThemeToggle } from '@/components/theme-toggle';
const categories = ['All pieces', 'Seating', 'Tables', 'Lighting', 'Objects'];
const collectionCopy: Record<string, string> = {
    Seating: 'Take a seat. Stay a while. Thoughtfully shaped chairs and sofas for every kind of pause.',
    Tables: 'A place to gather, set something down, and make room for the moments in between.',
    Lighting: 'Warm pools of light and beautiful silhouettes, from the first cup to the last page.',
    Objects: 'The little things that make a space feel entirely yours.'
};
type Panel = 'bag' | 'saved' | 'menu' | null;
type ModelContext = {
    registerTool: (tool: {
        name: string;
        description: string;
        inputSchema: object;
        annotations: {
            readOnlyHint: boolean;
        };
        execute: (input: unknown) => unknown;
    }, options: {
        signal: AbortSignal;
    }) => void | Promise<void>;
};
function Quantity({ value, onChange, label }: {
    value: number;
    onChange: (n: number) => void;
    label: string;
}) {
    return <div className="quantity"><button aria-label={`Decrease ${label} quantity`} disabled={value <= 1} onClick={() => onChange(value - 1)}><Minus size={14}/></button><span aria-live="polite">{value}</span><button aria-label={`Increase ${label} quantity`} disabled={value >= 10} onClick={() => onChange(value + 1)}><Plus size={14}/></button></div>;
}
export default function Home({ categoryPage, productPage }: { categoryPage?: string; productPage?: string } = {}) {
    const pageProduct = productPage ? products.find(p => p.id === productPage) : undefined;
    const [category, setCategory] = useState(categoryPage || 'All pieces');
    const [sort, setSort] = useState('featured');
    const [priceBand, setPriceBand] = useState('all');
    const [panel, setPanel] = useState<Panel>(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState<Product | null>(null);
    const [finish, setFinish] = useState(pageProduct?.finishes[0].name || '');
    const [quantity, setQuantity] = useState(1);
    const [cart, setCart] = useState<CartLine[]>([]);
    const [saved, setSaved] = useState<string[]>([]);
    const [ready, setReady] = useState(false);
    const [checkout, setCheckout] = useState(false);
    const [complete, setComplete] = useState(false);
    const [delivery, setDelivery] = useState('standard');
    const [showAll, setShowAll] = useState(false);
    const [receipt, setReceipt] = useState({ total: 0, items: 0 });
    const [info, setInfo] = useState<string | null>(null);
    const cartRef = useRef(cart);
    useEffect(() => { cartRef.current = cart; }, [cart]);
    useEffect(() => {
        // Hydrate browser-only preferences after SSR, once. The ready flag prevents
        // the persistence effect from overwriting stored data with the SSR defaults.
        /* eslint-disable react-hooks/set-state-in-effect */
        try {
            setCart(validCart(JSON.parse(localStorage.getItem('forma-bag-v1') || '[]')));
            const previous = JSON.parse(localStorage.getItem('forma-saved-v1') || '[]');
            if (Array.isArray(previous))
                setSaved(previous.filter(id => typeof id === 'string' && products.some(p => p.id === id)));
        }
        catch { /* Start fresh when storage is unavailable or corrupt. */ }
        setReady(true);
        /* eslint-enable react-hooks/set-state-in-effect */
    }, []);
    useEffect(() => { if (ready)
        try {
            localStorage.setItem('forma-bag-v1', JSON.stringify(cart));
            localStorage.setItem('forma-saved-v1', JSON.stringify(saved));
        }
        catch { /* The bag still works in memory. */ } }, [cart, saved, ready]);
    const openProduct = useCallback((p: Product) => { setSelected(p); setFinish(p.finishes[0].name); setQuantity(1); setSearchOpen(false); setPanel(null); }, []);
    const browse = (value = 'All pieces') => { if (pageProduct || categoryPage) { window.location.href = value === 'All pieces' ? '/#collection' : `/collections/${value.toLowerCase()}`; return; } setCategory(value); setShowAll(true); setPanel(null); document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' }); };
    const toggleSaved = (id: string) => { const next = saved.includes(id) ? saved.filter(x => x !== id) : [...saved, id]; setSaved(next); try { localStorage.setItem('forma-saved-v1', JSON.stringify(next)); } catch { /* Saved pieces still work in memory. */ } };
    const addToBag = useCallback((p: Product, chosen: string, count: number) => {
        const previous = cartRef.current;
        const exists = previous.find(line => line.id === p.id && line.finish === chosen);
        const next = exists ? previous.map(line => line === exists ? { ...line, quantity: Math.min(10, line.quantity + count) } : line) : [...previous, { id: p.id, finish: chosen, quantity: count }];
        cartRef.current = next;
        setCart(next);
        try { localStorage.setItem('forma-bag-v1', JSON.stringify(next)); } catch { /* The bag still works in memory. */ }
        toast.success(`${p.name} added to your bag`, { description: chosen, action: { label: 'View bag', onClick: () => { setSelected(null); setPanel('bag'); } } });
    }, []);
    useEffect(() => {
        const context = (document as Document & {
            modelContext?: ModelContext;
        }).modelContext;
        if (!context?.registerTool)
            return;
        const lifecycle = new AbortController();
        const tools = [
            { name: 'search_furniture', description: 'Search the Forma sample catalog by product name, category, or material. Returns products and prices in USD.', inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'], additionalProperties: false }, annotations: { readOnlyHint: true }, execute: (input: unknown) => { if (!input || typeof input !== 'object' || !('query' in input) || typeof input.query !== 'string')
                    throw new Error('query must be a string'); const q = input.query.toLowerCase(); return products.filter(p => `${p.name} ${p.category} ${p.material}`.toLowerCase().includes(q)).map(p => ({ id: p.id, name: p.name, price: p.price, finishes: p.finishes.map(f => f.name) })); } },
            { name: 'add_furniture_to_bag', description: 'Add a sample product and finish to the visible shopping bag. This stages a selection and never places an order or charges money.', inputSchema: { type: 'object', properties: { productId: { type: 'string' }, finish: { type: 'string' }, quantity: { type: 'integer', minimum: 1, maximum: 10 } }, required: ['productId', 'finish', 'quantity'], additionalProperties: false }, annotations: { readOnlyHint: false }, execute: (input: unknown) => { if (!input || typeof input !== 'object')
                    throw new Error('Product, finish and quantity are required'); const v = input as {
                    productId: string;
                    finish: string;
                    quantity: number;
                }; const p = products.find(x => x.id === v.productId); if (!p || !p.finishes.some(f => f.name === v.finish) || !Number.isInteger(v.quantity) || v.quantity < 1 || v.quantity > 10)
                    throw new Error('Choose a valid product, finish and quantity from 1 to 10'); flushSync(() => { addToBag(p, v.finish, v.quantity); setPanel('bag'); }); return { status: 'added', productId: p.id, bag: cartRef.current }; } }
        ];
        for (const tool of tools)
            try {
                void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => { });
            }
            catch { /* Unsupported implementations do not affect shopping. */ }
        return () => lifecycle.abort();
    }, [addToBag]);
    const count = cart.reduce((sum, line) => sum + line.quantity, 0);
    const subtotal = cart.reduce((sum, line) => sum + (products.find(p => p.id === line.id)?.price || 0) * line.quantity, 0);
    const shipping = delivery === 'white-glove' ? 95 : subtotal >= 1000 ? 0 : 45;
    const results = products.filter(p => `${p.name} ${p.category} ${p.material}`.toLowerCase().includes(query.trim().toLowerCase()));
    const filtered = useMemo(() => { const list = products.filter(p => (category === 'All pieces' || p.category === category) && (priceBand === 'all' || (priceBand === 'under-250' && p.price < 250) || (priceBand === '250-750' && p.price >= 250 && p.price <= 750) || (priceBand === 'over-750' && p.price > 750))); if (sort === 'price-low')
        list.sort((a, b) => a.price - b.price); if (sort === 'price-high')
        list.sort((a, b) => b.price - a.price); if (sort === 'name')
        list.sort((a, b) => a.name.localeCompare(b.name)); return list; }, [category, sort, priceBand]);
    const displayed = showAll || !!categoryPage || category !== 'All pieces' || sort !== 'featured' || priceBand !== 'all' ? filtered : filtered.slice(0, 4);
    const changeLine = (index: number, value: number) => setCart(previous => previous.map((line, i) => i === index ? { ...line, quantity: value } : line));
    const productCard = (p: Product) => <article className="product-card" key={p.id}><div className="product-image-wrap"><Link className="product-image-button" href={`/products/${p.id}`} aria-label={`View ${p.name}`}><img src={p.image} alt={p.name} loading="lazy" style={{ objectPosition: p.position }}/></Link>{p.badge && <span className="product-label">{p.badge}</span>}<button className={`save-button ${saved.includes(p.id) ? 'is-saved' : ''}`} aria-label={`${saved.includes(p.id) ? 'Unsave' : 'Save'} ${p.name}`} aria-pressed={saved.includes(p.id)} onClick={() => toggleSaved(p.id)}><Heart size={18}/></button><button className="quick-add" aria-label={`Choose options for ${p.name}`} onClick={() => openProduct(p)}><Plus size={20}/></button></div><div className="product-title"><h3><Link href={`/products/${p.id}`}>{p.name}</Link></h3><span>{money(p.price)}</span></div><p className="product-detail">{p.material} · {p.finishes[0].name}</p><div className="swatches" aria-label={`Available in ${p.finishes.length} finish${p.finishes.length === 1 ? '' : 'es'}`}>{p.finishes.map(f => <button key={f.name} style={{ background: f.color }} aria-label={`View ${p.name} in ${f.name}`} onClick={() => { openProduct(p); setFinish(f.name); }}/>)}</div></article>;
    const priceControl = <Select value={priceBand} onValueChange={setPriceBand}><SelectTrigger aria-label="Filter by price" className="sort-select price-select"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All prices</SelectItem><SelectItem value="under-250">Under $250</SelectItem><SelectItem value="250-750">$250–$750</SelectItem><SelectItem value="over-750">Over $750</SelectItem></SelectContent></Select>;
    const sortControl = <Select value={sort} onValueChange={setSort}><SelectTrigger aria-label="Sort products" className="sort-select"><SlidersHorizontal size={14}/><SelectValue /></SelectTrigger><SelectContent><SelectItem value="featured">Featured</SelectItem><SelectItem value="price-low">Price: low to high</SelectItem><SelectItem value="price-high">Price: high to low</SelectItem><SelectItem value="name">Name: A to Z</SelectItem></SelectContent></Select>;
    return <>
    <Toaster theme="light" position="bottom-left"/>
    <Link className="skip-link" href={pageProduct ? '#product-detail' : '#collection'}>Skip to {pageProduct ? 'product details' : 'collection'}</Link>
    <div className="announcement">A little more considered. A little more you. <Link href="/#collection">Discover the collection <ArrowUpRight size={12}/></Link></div>
    <header className="site-header">
      <Link href="/" className="wordmark" aria-label="Forma home">forma<span>®</span></Link>
      <nav className="desktop-nav" aria-label="Main navigation"><Link href="/collections/seating">Seating</Link><Link href="/collections/tables">Tables</Link><Link href="/collections/lighting">Lighting</Link><Link href="/collections/objects">Objects</Link><Link href="/#story">Our story</Link></nav>
      <div className="header-actions"><ThemeToggle/><button aria-label="Search furniture" onClick={() => setSearchOpen(true)}><Search /></button><button aria-label={`Saved pieces (${saved.length})`} onClick={() => setPanel('saved')} className="saved-nav"><Heart />{saved.length > 0 && <i>{saved.length}</i>}</button><button className="bag-button" aria-label={`Open shopping bag (${count} items)`} onClick={() => setPanel('bag')}><ShoppingBag /><span>Bag ({count})</span>{count > 0 && <i className="mobile-bag-count">{count}</i>}</button><button className="mobile-menu" aria-label="Open menu" onClick={() => setPanel('menu')}><Menu /></button></div>
    </header>
    <main>
      {!categoryPage && !pageProduct && <><section className="hero">
        <img src="/images/hero.jpg" alt="A thoughtfully furnished living room in natural tones" className="hero-image" fetchPriority="high"/>
        <div className="hero-shade"/>
        <div className="hero-content"><p className="eyebrow">THE ART OF FEELING AT HOME</p><h1>Good design.<br /><em>Better living.</em></h1><p>Considered furniture. Natural materials.<br />For the everyday moments that matter.</p><Link className="button button-light" href="#collection">Explore the collection <ArrowUpRight size={19}/></Link></div>
        <div className="hero-caption"><span>ROOM TO SLOW DOWN</span><span>The living collection, thoughtfully composed.</span></div>
        <button className="hero-feature" onClick={() => browse('Seating')}><span className="feature-plus"><Plus size={18}/></span><span>Explore the living collection <ArrowUpRight size={15}/></span></button>
      </section>
      <div className="values-strip"><span>Made for real life</span><span>Honest materials</span><span>Thoughtful by design</span><span>Timeless, never ordinary</span></div></>}
      {categoryPage && <section className="category-intro"><div><p className="eyebrow"><Link href="/">HOME</Link> / THE COLLECTIONS</p><h1>{categoryPage}<em>.</em></h1><p>{collectionCopy[categoryPage]}</p><span>{products.filter(p => p.category === categoryPage).length} considered pieces</span></div><img src={products.find(p => p.category === categoryPage)?.image} alt={`${categoryPage} collection`} style={{ objectPosition: products.find(p => p.category === categoryPage)?.position }}/></section>}
      {pageProduct && <><section className="product-page section-wrap" id="product-detail"><div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><Link href={`/collections/${pageProduct.category.toLowerCase()}`}>{pageProduct.category}</Link><span>/</span>{pageProduct.name}</div><div className="product-page-layout"><div className="detail-photo"><img src={pageProduct.image} alt={pageProduct.name} style={{ objectPosition: pageProduct.position }}/><span>Shown in {pageProduct.finishes[0].name}</span></div><div className="detail-copy"><p className="eyebrow">FORMA / {pageProduct.category.toUpperCase()}</p><h1 className="detail-title">{pageProduct.name}</h1><p className="detail-price">{money(pageProduct.price)} <span>USD</span></p><p className="detail-description">{pageProduct.description}</p><div className="finish-label">Finish <strong>{finish}</strong></div><RadioGroup value={finish} onValueChange={setFinish} className="finish-options" aria-label="Choose a finish">{pageProduct.finishes.map(f => <label key={f.name} className={finish === f.name ? 'chosen' : ''}><RadioGroupItem value={f.name} aria-label={f.name} className="finish-radio" style={{ backgroundColor: f.color }}/><span>{f.name}</span></label>)}</RadioGroup><div className="purchase-row"><Quantity value={quantity} onChange={setQuantity} label={pageProduct.name}/><button className="button button-olive" onClick={() => addToBag(pageProduct, finish, quantity)}>Add to bag <span>{money(pageProduct.price * quantity)}</span></button></div><button className="detail-save" onClick={() => toggleSaved(pageProduct.id)} aria-pressed={saved.includes(pageProduct.id)}><Heart size={17} fill={saved.includes(pageProduct.id) ? 'currentColor' : 'none'}/>{saved.includes(pageProduct.id) ? 'Saved to your favourites' : 'Save for a little later'}</button><div className="product-spec"><span>Dimensions</span><p>{pageProduct.dimensions}</p></div><div className="product-spec"><span>Materials</span><p>{pageProduct.material}</p></div><p className="detail-delivery"><Truck size={18}/> Sample delivery: 2–4 weeks</p><p className="demo-note">Concept product. Checkout is a demo; no payment is taken.</p></div></div></section><section className="section-wrap related"><div className="section-heading"><div><p className="eyebrow">GOES WELL WITH</p><h2>More to <em>love.</em></h2></div><Link className="text-link" href={`/collections/${pageProduct.category.toLowerCase()}`}>Explore {pageProduct.category.toLowerCase()} <ArrowUpRight size={18}/></Link></div><div className="product-grid">{products.filter(p => p.category === pageProduct.category && p.id !== pageProduct.id).slice(0, 4).map(productCard)}</div></section></>}
      {!pageProduct && <><section className="collection section-wrap" id="collection">
        {!categoryPage && <div className="section-heading"><div><p className="eyebrow">FIND YOUR EVERYDAY FAVOURITES</p><h2>A place for <em>good things.</em></h2></div><button className="text-link" onClick={() => browse()}>Shop all furniture <ArrowUpRight size={18}/></button></div>}
        <div className="collection-controls"><div className="categories" aria-label="Filter products by category">{categoryPage ? <><Link href="/">All pieces</Link>{categories.slice(1).map(c => <Link key={c} href={`/collections/${c.toLowerCase()}`} className={categoryPage === c ? 'active' : ''} aria-current={categoryPage === c ? 'page' : undefined}>{c}</Link>)}</> : categories.map(c => <button key={c} className={category === c ? 'active' : ''} aria-pressed={category === c} onClick={() => { setCategory(c); setShowAll(true); }}>{c}</button>)}</div><div className="filter-selects">{priceControl}{sortControl}</div></div>
        <p className="catalog-count">Showing {displayed.length} of {products.filter(p => category === 'All pieces' || p.category === category).length} pieces</p>
        {displayed.length ? <div className="product-grid" id="products" aria-live="polite">{displayed.map(productCard)}</div> : <div className="catalog-empty"><h3>No pieces in this price range.</h3><button className="text-link" onClick={() => setPriceBand('all')}>Show all prices <ArrowRight size={17}/></button></div>}
        {!categoryPage && !showAll && category === 'All pieces' && sort === 'featured' && priceBand === 'all' && <div className="view-collection"><button className="button button-outline" onClick={() => setShowAll(true)}>View all {products.length} pieces <ArrowRight size={17}/></button></div>}
      </section>{!categoryPage && <><section className="collection-explore section-wrap"><div className="section-heading"><div><p className="eyebrow">FIND YOUR KIND OF COMFORT</p><h2>Explore the <em>collections.</em></h2></div></div><div className="explore-grid">{categories.slice(1).map(c => { const p = products.find(item => item.category === c)!; return <Link key={c} href={`/collections/${c.toLowerCase()}`}><img src={p.image} alt="" style={{ objectPosition: p.position }}/><span>{c}<ArrowUpRight size={21}/></span></Link>; })}</div></section><section className="story section-wrap" id="story"><p className="eyebrow">LESS, BUT WITH MEANING.</p><h2>A home is a collection<br />of things you <em>love.</em></h2><p>We believe the pieces you live with should make you feel something. A beautiful curve. The warmth of wood. A quiet corner that’s entirely yours.</p><Link className="text-link" href="#collection">Find your piece <ArrowRight size={18}/></Link></section></>}</>}
    </main>
    <footer className="site-footer"><div className="footer-brand"><Link href="/" className="wordmark">forma<span>®</span></Link><p>Considered pieces. Everyday living.</p></div><nav aria-label="Footer navigation"><Link href="/collections/seating">Seating</Link><Link href="/collections/tables">Tables</Link><Link href="/collections/lighting">Lighting</Link><Link href="/collections/objects">Objects</Link><button onClick={() => setInfo('Delivery & returns')}>Delivery & returns</button><button onClick={() => setInfo('Care guide')}>Care guide</button><button onClick={() => setInfo('About this store')}>About this store</button></nav><div className="footer-bottom"><span>© {new Date().getFullYear()} Forma Studio</span><span>Concept store · USD · Demo checkout</span></div></footer>

    <Dialog open={searchOpen} onOpenChange={setSearchOpen}><DialogContent className="search-dialog"><DialogTitle className="dialog-title">Find your next good thing.</DialogTitle><DialogDescription>Search furniture, lighting and objects.</DialogDescription><div className="search-field"><Search size={21}/><input autoFocus placeholder="Try “chair” or “ceramic”" aria-label="Search the collection" value={query} onChange={e => setQuery(e.target.value)}/>{query && <button aria-label="Clear search" onClick={() => setQuery('')}><X size={17}/></button>}</div><div className="search-results" aria-live="polite">{results.length ? results.map(p => <button className="search-result" key={p.id} onClick={() => openProduct(p)}><img src={p.image} alt="" style={{ objectPosition: p.position }}/><span><strong>{p.name}</strong><small>{p.category} · {money(p.price)}</small></span><ArrowUpRight size={18}/></button>) : <Empty className="empty-state"><Search size={30}/><h3>No pieces found</h3><p>Try a different name, material or category.</p><button className="text-link" onClick={() => setQuery('')}>Browse all pieces <ArrowRight size={17}/></button></Empty>}</div></DialogContent></Dialog>

    <Dialog open={!!selected} onOpenChange={value => { if (!value)
        setSelected(null); }}><DialogContent className="product-dialog">{selected && <><div className="detail-photo"><img src={selected.image} alt={`${selected.name}, shown in ${selected.finishes[0].name}`} style={{ objectPosition: selected.position }}/><span>Shown in {selected.finishes[0].name}</span></div><div className="detail-copy"><p className="eyebrow">FORMA / {selected.category.toUpperCase()}</p><DialogTitle className="detail-title">{selected.name}</DialogTitle><p className="detail-price">{money(selected.price)} <span>USD</span></p><DialogDescription className="detail-description">{selected.description}</DialogDescription><div className="finish-label">Finish <strong>{finish}</strong></div><RadioGroup value={finish} onValueChange={setFinish} className="finish-options" aria-label="Choose a finish">{selected.finishes.map(f => <label key={f.name} className={finish === f.name ? 'chosen' : ''}><RadioGroupItem value={f.name} aria-label={f.name} className="finish-radio" style={{ backgroundColor: f.color }}/><span>{f.name}</span></label>)}</RadioGroup><div className="purchase-row"><Quantity value={quantity} onChange={setQuantity} label={selected.name}/><button className="button button-olive" onClick={() => addToBag(selected, finish, quantity)}>Add to bag <span>{money(selected.price * quantity)}</span></button></div><button className="detail-save" onClick={() => toggleSaved(selected.id)} aria-pressed={saved.includes(selected.id)}><Heart size={17} fill={saved.includes(selected.id) ? 'currentColor' : 'none'}/>{saved.includes(selected.id) ? 'Saved to your favourites' : 'Save for a little later'}</button><div className="product-spec"><span>Dimensions</span><p>{selected.dimensions}</p></div><div className="product-spec"><span>Materials</span><p>{selected.material}</p></div><p className="detail-delivery"><Truck size={18}/> Sample delivery: 2–4 weeks</p><p className="demo-note">Concept product. Checkout is a demo; no payment is taken.</p></div></>}</DialogContent></Dialog>

    <Sheet open={panel !== null} onOpenChange={value => { if (!value)
        setPanel(null); }}><SheetContent className="store-sheet"><div className="sheet-heading"><p className="eyebrow">A LITTLE MORE YOU</p><SheetTitle>{panel === 'bag' ? `Your bag (${count})` : panel === 'saved' ? 'Your saved pieces' : 'Make yourself at home.'}</SheetTitle><SheetDescription>{panel === 'bag' ? 'Good things, chosen by you.' : panel === 'saved' ? 'Keep the pieces you love close.' : 'Explore the Forma collection.'}</SheetDescription></div>
      {panel === 'menu' ? <nav className="mobile-nav" aria-label="Mobile navigation"><div className="mobile-theme-row"><ThemeToggle mobile/></div><Link href="/">All pieces<ArrowUpRight size={22}/></Link>{categories.slice(1).map(c => <Link key={c} href={`/collections/${c.toLowerCase()}`}>{c}<ArrowUpRight size={22}/></Link>)}<Link href="/#story">Our story <ArrowUpRight size={22}/></Link></nav> : panel === 'saved' ? <div className="sheet-body">{saved.length ? products.filter(p => saved.includes(p.id)).map(p => <div className="saved-row" key={p.id}><button className="saved-product" onClick={() => openProduct(p)}><img src={p.image} alt={p.name} style={{ objectPosition: p.position }}/><span><strong>{p.name}</strong><small>{money(p.price)}</small><span className="saved-view">Choose options <ArrowUpRight size={13}/></span></span></button><button className="icon-button" aria-label={`Remove ${p.name} from saved pieces`} onClick={() => toggleSaved(p.id)}><X size={17}/></button></div>) : <Empty className="empty-state"><Heart size={36}/><h3>Something will catch your eye.</h3><p>Tap the heart on any piece to save it here.</p><button className="button button-olive" onClick={() => browse()}>Explore the collection <ArrowUpRight size={17}/></button></Empty>}</div> : <>{cart.length ? <><div className="delivery-progress"><p>{subtotal >= 1000 ? 'Your bag qualifies for complimentary standard delivery.' : `${money(1000 - subtotal)} away from complimentary standard delivery.`}</p><div><span style={{ width: `${Math.min(100, subtotal / 10)}%` }}/></div></div><div className="sheet-body cart-lines">{cart.map((line, index) => { const p = products.find(p => p.id === line.id)!; return <div className="cart-line" key={`${line.id}-${line.finish}`}><button className="cart-image" onClick={() => openProduct(p)}><img src={p.image} alt={p.name} style={{ objectPosition: p.position }}/></button><div className="cart-line-copy"><div className="cart-line-top"><h3>{p.name}</h3><button className="icon-button" aria-label={`Remove ${p.name} ${line.finish} from bag`} onClick={() => setCart(previous => previous.filter((_, i) => i !== index))}><Trash2 size={15}/></button></div><p>{line.finish}</p><div className="cart-line-bottom"><Quantity value={line.quantity} onChange={value => changeLine(index, value)} label={`${p.name} ${line.finish}`}/><span>{money(p.price * line.quantity)}</span></div></div></div>; })}</div><div className="bag-footer"><div className="subtotal-row"><span>Subtotal</span><strong>{money(subtotal)}</strong></div><p>Delivery options at checkout. All prices in USD.</p><button className="button button-olive" onClick={() => { setPanel(null); setComplete(false); setDelivery('standard'); setCheckout(true); }}>Continue to demo checkout <ArrowRight size={18}/></button><button className="continue-shopping" onClick={() => setPanel(null)}>Continue exploring</button></div></> : <Empty className="empty-state"><ShoppingBag size={38}/><h3>Make room for something good.</h3><p>Your bag is empty. Let’s find a piece that feels like you.</p><button className="button button-olive" onClick={() => browse()}>Explore the collection <ArrowUpRight size={17}/></button></Empty>}</>}
    </SheetContent></Sheet>

    <Dialog open={checkout} onOpenChange={setCheckout}><DialogContent className="checkout-dialog">{complete ? <div className="checkout-complete"><div className="complete-icon"><Check size={28}/></div><p className="eyebrow">A WELL-CONSIDERED CHOICE</p><DialogTitle className="dialog-title">Looks good in your future home.</DialogTitle><DialogDescription>Your demo checkout is complete. No payment was taken and no order will be shipped.</DialogDescription><div className="demo-receipt"><span>{receipt.items} {receipt.items === 1 ? 'piece' : 'pieces'}</span><strong>{money(receipt.total)}</strong></div><button className="button button-olive" onClick={() => { setCheckout(false); browse(); }}>Continue exploring <ArrowUpRight size={18}/></button></div> : <><p className="eyebrow">THE FINAL LITTLE DETAILS</p><DialogTitle className="dialog-title">Your considered collection.</DialogTitle><DialogDescription>This is a demo checkout. You can try the full experience without entering payment details.</DialogDescription><div className="checkout-items">{cart.map(line => { const p = products.find(x => x.id === line.id)!; return <div key={`${line.id}-${line.finish}`}><img src={p.image} alt="" style={{ objectPosition: p.position }}/><span>{p.name}<small>{line.finish} · Qty {line.quantity}</small></span><strong>{money(p.price * line.quantity)}</strong></div>; })}</div><h3 className="checkout-subheading">Delivery preference</h3><RadioGroup value={delivery} onValueChange={setDelivery} className="delivery-options" aria-label="Delivery preference"><label><RadioGroupItem value="standard"/><span>Standard delivery<small>To your doorstep · 2–4 weeks</small></span><strong>{subtotal >= 1000 ? 'Complimentary' : money(45)}</strong></label><label><RadioGroupItem value="white-glove"/><span>White glove delivery<small>To your room, with packaging removed</small></span><strong>{money(95)}</strong></label></RadioGroup><div className="checkout-totals"><div><span>Subtotal</span><span>{money(subtotal)}</span></div><div><span>Delivery</span><span>{shipping === 0 ? 'Complimentary' : money(shipping)}</span></div><div className="checkout-total"><strong>Estimated total</strong><strong>{money(subtotal + shipping)}</strong></div></div><p className="demo-note">Sample prices exclude tax. Live payments, inventory and tax calculation are not connected.</p><button className="button button-olive" disabled={!cart.length} onClick={() => { setReceipt({ total: subtotal + shipping, items: count }); setCart([]); setComplete(true); }}>Complete demo checkout <ArrowRight size={18}/></button><button className="continue-shopping" onClick={() => { setCheckout(false); setPanel('bag'); }}><ArrowLeft size={14}/> Back to your bag</button></>}</DialogContent></Dialog>

    <Dialog open={!!info} onOpenChange={open => { if (!open)
        setInfo(null); }}><DialogContent className="info-dialog"><DialogTitle className="dialog-title">{info}</DialogTitle><DialogDescription>{info === 'Delivery & returns' ? 'A considered arrival.' : info === 'Care guide' ? 'A little care goes a long way.' : 'Welcome to Forma Studio.'}</DialogDescription>{info === 'Delivery & returns' ? <div className="info-copy"><Truck /><h3>Sample delivery options</h3><p>Standard delivery is $45, or complimentary for a bag of $1,000 or more. White glove delivery is $95. The demo estimates 2–4 weeks.</p><PackageCheck /><h3>Before a real launch</h3><p>This is a concept storefront. Delivery, returns, availability and pricing must be confirmed by the store owner before accepting real orders. No goods are shipped from this demo.</p></div> : info === 'Care guide' ? <div className="info-copy"><h3>Timber</h3><p>Dust with a soft, dry cloth. Wipe spills promptly and use coasters to protect the finish. Keep furniture away from direct heat and prolonged sunlight.</p><h3>Upholstery</h3><p>Vacuum gently with an upholstery attachment. Blot spills without rubbing, and test any cleaner on a hidden area first.</p><h3>Ceramics & lighting</h3><p>Wipe ceramic surfaces with a damp cloth. Disconnect lighting from power before cleaning and follow the fitting’s care instructions.</p></div> : <div className="info-copy"><p>Forma is a furniture store concept, built around natural textures, quiet shapes and everyday comfort.</p><p>The product names, prices, finishes and dimensions are sample content. Photography and interior visualizations are from Unsplash and Pexels. Product options illustrate the shopping experience and do not represent verified inventory.</p><p>Your bag and saved pieces stay in this browser. Demo checkout takes no payment and creates no real order.</p></div>}</DialogContent></Dialog>
  </>;
}
