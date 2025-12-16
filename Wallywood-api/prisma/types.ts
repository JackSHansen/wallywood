import { setDefaultHighWaterMark } from "stream";

export const fieldTypes: Record<string, Record<string, 'string' | 'number' | 'boolean' | 'date'>> = {
    user: {
        id: 'number',
        firstname: 'string',
        lastname: 'string',
        email: 'string',
        password: 'string',
        role: 'string',
        isActive: 'boolean'
    },
    genre: {
        id: 'number',
        name: 'string',
        slug: 'string',
        createdAt: 'date',
        updatedAt: 'date'
    },
    poster: {
        id: 'number',
        name: 'string',
        slug: 'string',
        description: 'string',
        image: 'string',
        width: 'number',
        height: 'number',
        price: 'number',
        stock: 'number',
        createdAt: 'date',
        updatedAt: 'date'
    },
    genrePosterRel: {
        posterId: 'number',
        genreId: 'number'
    },
    
    userRating: {
        id: 'number',
        userId: 'number',
        posterId: 'number',
        numStars: 'number',
        createdAt: 'date',
        updatedAt: 'date'
    },
     CartLine: {
        id: 'number',
        userId: 'number',
        posterId: 'number',
        genreId: 'number',
        quantity: 'number',
        createdAt: 'date',
        updatedAt: 'date'
    },
}