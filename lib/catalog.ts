export type Product = {
    id: string;
    name: string;
    category: string;
    price: number;
    image: string;
    material: string;
    finishes: {
        name: string;
        color: string;
    }[];
    description: string;
    dimensions: string;
    badge?: string;
    position?: string;
};
export const products: Product[] = [
    { id: 'arc', name: 'The Arc lounge chair', category: 'Seating', price: 690, image: '/images/chair.jpg', material: 'Canvas & steel', finishes: [{ name: 'Sand', color: '#d6caba' }, { name: 'Olive', color: '#7d836b' }, { name: 'Charcoal', color: '#494a45' }], description: 'An easy silhouette with a little unexpected movement. A generously curved canvas seat rests within a fine steel frame, making Arc a natural home for a book and an unhurried afternoon.', dimensions: 'W 78 × D 80 × H 76 cm', badge: 'STUDIO FAVOURITE' },
    { id: 'sunday', name: 'The Sunday corner sofa', category: 'Seating', price: 1890, image: '/images/sofa.jpg', material: 'Textured weave', finishes: [{ name: 'Cloud', color: '#b3b5b2' }, { name: 'Oat', color: '#d4cbbd' }, { name: 'Moss', color: '#6d745e' }], description: 'Room for the whole weekend. Deep cushions, a relaxed low profile and a generous corner shape invite you to stretch out, settle in and stay a little longer.', dimensions: 'W 290 × D 230 × H 82 cm', badge: 'NEW ARRIVAL', position: '50% 64%' },
    { id: 'form', name: 'The Form coffee table', category: 'Tables', price: 480, image: '/images/table.jpg', material: 'Solid timber', finishes: [{ name: 'Walnut', color: '#79583d' }, { name: 'Natural', color: '#bb9d73' }], description: 'A grounded centrepiece with softly rounded edges. Its sculptural legs and richly grained surface bring warmth and character to the space between seats.', dimensions: 'W 110 × D 60 × H 38 cm' },
    { id: 'halo', name: 'The Halo pendant', category: 'Lighting', price: 240, image: '/images/lamp.jpg', material: 'Pleated ceramic & brass', finishes: [{ name: 'Warm white', color: '#eeeae0' }], description: 'A delicate pleated shade meets a warm brass fitting. Beautiful on its own above a reading nook, or in a considered row over a dining table.', dimensions: 'Ø 32 × H 24 cm · 150 cm cable' },
    { id: 'timber', name: 'The Timber armchair', category: 'Seating', price: 560, image: '/images/timber-chair.jpg', material: 'Timber & woven upholstery', finishes: [{ name: 'Natural', color: '#bcae96' }, { name: 'Smoked', color: '#766657' }], description: 'Simple lines, tactile grain and a softly cushioned seat. Timber pairs a reassuringly solid frame with the quiet comfort of everyday upholstery.', dimensions: 'W 72 × D 77 × H 80 cm' },
    { id: 'pebble', name: 'The Pebble lounge chair', category: 'Seating', price: 790, image: '/images/lounge.jpg', material: 'Woven upholstery & wood', finishes: [{ name: 'Stone', color: '#a9aaa6' }, { name: 'Cream', color: '#dbd5c9' }], description: 'Soft at every angle. Pebble wraps a gently rounded shell around a generous seat, balanced on slender wooden legs. A little retreat, wherever you put it.', dimensions: 'W 85 × D 84 × H 79 cm' },
    { id: 'still', name: 'The Still ceramic vase', category: 'Objects', price: 65, image: '/images/vase.jpg', material: 'Glazed ceramic', finishes: [{ name: 'Chalk', color: '#e4e5e0' }], description: 'A quiet, rounded form with a narrow opening. Fill it with a single stem or leave it empty; Still holds its own as a small sculptural object.', dimensions: 'Ø 22 × H 28 cm', badge: 'THE FINISHING TOUCH', position: '50% 92%' },
];
export type CartLine = {
    id: string;
    finish: string;
    quantity: number;
};
export const money = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
export function validCart(value: unknown): CartLine[] {
    if (!Array.isArray(value))
        return [];
    return value.filter((line): line is CartLine => !!line && typeof line === 'object' && products.some(p => p.id === line.id && p.finishes.some(f => f.name === line.finish)) && Number.isInteger(line.quantity) && line.quantity > 0 && line.quantity <= 10).slice(0, 50);
}
