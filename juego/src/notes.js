import first from './entries/entrada-1.md?raw';
import second from './entries/entrada-2.md?raw';
import third from './entries/entrada-3.md?raw';
import fourth from './entries/entrada-4.md?raw';
import fifth from './entries/entrada-5.md?raw';
import sixth from './entries/entrada-6.md?raw';
import seventh from './entries/entrada-7.md?raw';

function entry(number, markdown) {
  const [heading, ...lines] = markdown.split('\n');
  return { number, title: heading.replace(/^#\s+/, ''), text: lines.join('\n').trim(), available: true };
}

// Keep the original class numbering. The legacy eighth entry is outside this mission.
export const notes = [
  entry(1, first), entry(2, second), entry(3, third), entry(4, fourth),
  entry(5, fifth),
  entry(6, sixth), entry(7, seventh),
  { number: 8, title: 'Todavía queda algo por descubrir', text: 'Esta historia está creciendo. El dado puede llevarte a otro encuentro mientras llega a este papel.', available: false },
];
