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
    { id: 'cove', name: 'The Cove dining chair', category: 'Seating', price: 320, image: '/images/new-7193628.jpg', material: 'Oak & woven cane', finishes: [{ name: 'Honey oak', color: '#9d6540' }, { name: 'Natural', color: '#c49a70' }], description: 'A slender oak frame and woven cane seat lend everyday dining an easy warmth. Its light profile works just as well beside a desk.', dimensions: 'W 46 × D 51 × H 78 cm', badge: 'NEW ARRIVAL', position: '68% 100%' },
    { id: 'solace', name: 'The Solace armchair', category: 'Seating', price: 740, image: '/images/new-37889619.jpg', material: 'Upholstered fabric & timber', finishes: [{ name: 'Cream', color: '#e6d9c2' }, { name: 'Clay', color: '#bd917b' }], description: 'A generous seat with a softly sculpted back and inviting arms. Solace brings a gentle, confident shape to a reading corner.', dimensions: 'W 82 × D 79 × H 83 cm', position: '50% 70%' },
    { id: 'rush', name: 'The Rush counter stool', category: 'Seating', price: 290, image: '/images/new-30184045.jpg', material: 'Solid wood & woven rush', finishes: [{ name: 'Natural oak', color: '#a57343' }], description: 'A tactile rush seat sits above a simple, sturdy timber frame. Pull one up at the kitchen counter for the everyday pause.', dimensions: 'W 39 × D 39 × H 67 cm', position: '50% 78%' },
    { id: 'grain', name: 'The Grain coffee table', category: 'Tables', price: 520, image: '/images/new-7607464.jpg', material: 'Solid oak', finishes: [{ name: 'Natural oak', color: '#b38d62' }, { name: 'Smoked oak', color: '#6e5038' }], description: 'Warm wood grain and a broad surface make Grain a quiet anchor for the living room. Made for books, cups and good company.', dimensions: 'W 105 × D 64 × H 39 cm' },
    { id: 'kindred', name: 'The Kindred side table', category: 'Tables', price: 225, image: '/images/new-12277405.jpg', material: 'Oak veneer & solid wood', finishes: [{ name: 'Natural', color: '#c6a17c' }, { name: 'Whitewash', color: '#ded1bd' }], description: 'A compact round top with a clean, open base. Keep it close to your favourite chair for a glass, a book or a single stem.', dimensions: 'Ø 48 × H 52 cm', position: '67% 57%' },
    { id: 'gather', name: 'The Gather dining table', category: 'Tables', price: 1190, image: '/images/new-11363678.jpg', material: 'Solid wood', finishes: [{ name: 'Walnut', color: '#65432e' }, { name: 'Dark oak', color: '#4f4031' }], description: 'A generous timber table for the meals that last a little longer. Its straightforward silhouette lets the natural grain do the talking.', dimensions: 'W 180 × D 90 × H 75 cm', position: '55% 65%' },
    { id: 'woven', name: 'The Woven pendant', category: 'Lighting', price: 295, image: '/images/new-6134899.jpg', material: 'Woven rattan', finishes: [{ name: 'Natural rattan', color: '#ac7040' }], description: 'Layers of handwoven rattan create a warm, patterned glow. A welcoming focal point above a table or in an entryway.', dimensions: 'Ø 42 × H 38 cm · 150 cm cable', badge: 'NEW ARRIVAL' },
    { id: 'lilt', name: 'The Lilt floor lamp', category: 'Lighting', price: 380, image: '/images/new-6633445.jpg', material: 'Timber & fabric shade', finishes: [{ name: 'Natural', color: '#b48a61' }, { name: 'White', color: '#eae8dc' }], description: 'A slim timber stem and softly flared shade bring an easy pool of light to the corner where you like to read.', dimensions: 'W 45 × D 45 × H 152 cm', position: '51% 60%' },
    { id: 'orbit', name: 'The Orbit floor lamp', category: 'Lighting', price: 425, image: '/images/new-19714779.jpg', material: 'Smoked glass & brass', finishes: [{ name: 'Smoked', color: '#6d5444' }], description: 'A rounded smoked-glass shade balances on a slender brass stem. Orbit adds a subtle glow and a little theatre after dark.', dimensions: 'Ø 34 × H 147 cm', position: '48% 60%' },
    { id: 'curve', name: 'The Curve vessel', category: 'Objects', price: 78, image: '/images/new-5825574.jpg', material: 'Matte ceramic', finishes: [{ name: 'Forest', color: '#3e5048' }, { name: 'Chalk', color: '#e2ded4' }], description: 'A simple handled silhouette with a pleasingly narrow opening. Let Curve hold a branch or stand beautifully on its own.', dimensions: 'W 18 × D 16 × H 24 cm', position: '48% 68%' },
    { id: 'line', name: 'The Line ceramic vase', category: 'Objects', price: 92, image: '/images/new-8217492.jpg', material: 'Unglazed ceramic', finishes: [{ name: 'Ivory', color: '#ece8da' }], description: 'An understated tall vase with a soft matte finish. A fine complement to dried stems and open shelving.', dimensions: 'Ø 14 × H 32 cm', position: '70% 62%' },
    { id: 'ember', name: 'The Ember candle', category: 'Objects', price: 48, image: '/images/new-27975928.jpg', material: 'Wax & stoneware vessel', finishes: [{ name: 'Stone', color: '#b6a8a2' }], description: 'A gentle decorative glow in a reusable stoneware vessel. Set it among books and favourite objects for a slower evening.', dimensions: 'Ø 10 × H 8 cm', position: '53% 70%' },
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
