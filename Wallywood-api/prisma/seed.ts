import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

function parseCSV(content: string): any[] {
  const lines = content.trim().split('\n');
  
  // Parse header
  const headerLine = lines[0];
  const headers: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < headerLine.length; i++) {
    const char = headerLine[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      headers.push(current.replace(/^"|"$/g, '').trim());
      current = '';
    } else {
      current += char;
    }
  }
  headers.push(current.replace(/^"|"$/g, '').trim());
  
  // Parse data rows
  const rows: any[] = [];
  let i = 1;
  
  while (i < lines.length) {
    let row = lines[i];
    let quoteCount = 0;
    
    // Count quotes to see if row is complete
    for (const char of row) {
      if (char === '"') quoteCount++;
    }
    
    // If odd number of quotes, row continues on next line
    while (quoteCount % 2 !== 0 && i + 1 < lines.length) {
      i++;
      row += '\n' + lines[i];
      for (const char of lines[i]) {
        if (char === '"') quoteCount++;
      }
    }
    
    // Parse the complete row
    const values: string[] = [];
    current = '';
    inQuotes = false;
    
    for (let j = 0; j < row.length; j++) {
      const char = row[j];
      const nextChar = row[j + 1];
      
      if (char === '"' && nextChar === '"' && inQuotes) {
        current += '"';
        j++;
      } else if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    // Create object from values
    const obj: any = {};
    headers.forEach((header, index) => {
      let value = values[index] || '';
      value = value.replace(/^"|"$/g, '').trim();
      
      if (value === '' || value === 'NULL') {
        obj[header] = null;
      } else if (header === 'id' || header === 'width' || header === 'height' || header === 'stock' || header === 'genreId' || header === 'posterId') {
        obj[header] = parseInt(value) || null;
      } else if (header === 'price') {
        obj[header] = parseFloat(value) || null;
      } else {
        obj[header] = value;
      }
    });
    
    // Only add if we have a valid id
    if (obj.id && !isNaN(obj.id)) {
      rows.push(obj);
    }
    
    i++;
  }
  
  return rows;
}

function generateSlug(name: string, id?: number): string {
  if (!name) return `poster-${id || Date.now()}`;
  
  let slug = name
    .toLowerCase()
    .replace(/[æ]/g, 'ae')
    .replace(/[ø]/g, 'oe')
    .replace(/[å]/g, 'aa')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
  
  if (id) {
    slug = `${slug}-${id}`;
  }
  
  return slug;
}

// Finder første eksisterende sti blandt kandidater (relativ til denne fil)
function resolveCsvPath(candidates: string[]) {
  for (const rel of candidates) {
    const p = path.resolve(__dirname, rel);
    if (fs.existsSync(p)) return p;
  }
  throw new Error(`CSV file not found. Tried: ${candidates.join(' | ')}`);
}

// Læser CSV ved at prøve flere standardplaceringer
function readCsvFile(fileName: string) {
  // Prøv begge kendte mapper samt projektroden
  const p = resolveCsvPath([
    `../Filer til opgaven/${fileName}`,
    `../csv filer/${fileName}`,
    `../${fileName}`,
  ]);
  return fs.readFileSync(p, 'utf-8');
}

async function main() {
  console.log('Starting seed...');

  // Seed users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  // Create 100 test users (ID 100-199 to match CSV data)
  const users = [];
  for (let i = 100; i <= 199; i++) {
    users.push({
      firstname: `User${i}`,
      lastname: `Test`,
      email: `user${i}@wallywood.dk`,
      password: hashedPassword,
      role: 'USER' as const,
      isActive: true
    });
  }
  
  // Add admin and regular user
  users.unshift(
    {
      firstname: 'Admin',
      lastname: 'User',
      email: 'admin@wallywood.dk',
      password: hashedPassword,
      role: 'ADMIN' as const,
      isActive: true
    },
    {
      firstname: 'Regular',
      lastname: 'User',
      email: 'user@wallywood.dk',
      password: hashedPassword,
      role: 'USER' as const,
      isActive: true
    }
  );
  
  await prisma.user.createMany({
    data: users,
    skipDuplicates: true
  });
  console.log('✓ Users seeded');

  // Seed genres
  const genreFile = readCsvFile('genre.csv');
  const genres = parseCSV(genreFile);
  for (const genre of genres) {
    await prisma.genre.upsert({
      where: { id: genre.id },
      update: {},
      create: {
        id: genre.id,
        title: genre.title,
        slug: genre.slug
      }
    });
  }
  console.log('✓ Genres seeded');

  // Seed posters
  const posterFile = readCsvFile('poster.csv');
  const posters = parseCSV(posterFile);
  
  for (const poster of posters) {
    let slug = poster.slug && poster.slug.trim() ? poster.slug : generateSlug(poster.name, poster.id);
    
    const existingPoster = await prisma.poster.findUnique({
      where: { slug: slug }
    });
    
    if (existingPoster && existingPoster.id !== poster.id) {
      slug = `${slug}-${poster.id}`;
    }
    
    await prisma.poster.upsert({
      where: { id: poster.id },
      update: {},
      create: {
        id: poster.id,
        name: poster.name || 'Unknown Poster',
        slug: slug,
        description: poster.description,
        image: poster.image || 'placeholder.jpg',
        width: poster.width || 70,
        height: poster.height || 100,
        price: poster.price || 50,
        stock: poster.stock || 0
      }
    });
  }
  console.log('✓ Posters seeded');

  // Seed genre-poster relations
  const relFile = readCsvFile('genrePosterRel.csv');
  const relations = parseCSV(relFile);
  
  for (const rel of relations) {
    try {
      await prisma.genrePosterRel.upsert({
        where: {
          genreId_posterId: {
            genreId: rel.genreId,
            posterId: rel.posterId
          }
        },
        update: {},
        create: {
          genreId: rel.genreId,
          posterId: rel.posterId
        }
      });
    } catch (error) {
      console.log(`Skipping invalid relation: genreId=${rel.genreId}, posterId=${rel.posterId}`);
    }
  }
  console.log('✓ Genre-Poster relations seeded');

  // Seed CartLines (hentes fx fra "csv filer/CartLine.csv")
  try {
    const cartLineFile = readCsvFile('CartLine.csv');
    const cartLines = parseCSV(cartLineFile);
    for (const cartLine of cartLines) {
      try {
        await prisma.cartLine.create({
          data: {
            userId: cartLine.UserID,
            posterId: cartLine.PosterID,
            quantity: cartLine.Quantity
          }
        });
      } catch {
        console.log(`Skipping invalid cartline: userId=${cartLine.UserID}, posterId=${cartLine.PosterID}`);
      }
    }
    console.log('✓ CartLines seeded');
  } catch {
    console.log('CartLine.csv not found or error reading file');
  }

  // Seed UserRatings (hentes fx fra "csv filer/UserRating.csv")
  try {
    const ratingFile = readCsvFile('UserRating.csv');
    const ratings = parseCSV(ratingFile);
    for (const rating of ratings) {
      try {
        await prisma.userRating.create({
          data: {
            userId: rating.UserID,
            posterId: rating.PosterID,
            numStars: rating.Rating
          }
        });
      } catch {
        console.log(`Skipping invalid rating: userId=${rating.UserID}, posterId=${rating.PosterID}`);
      }
    }
    console.log('✓ UserRatings seeded');
  } catch {
    console.log('UserRating.csv not found or error reading file');
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
