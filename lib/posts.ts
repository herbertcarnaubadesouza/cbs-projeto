import { prisma } from '@/lib/prisma';

export async function getPublishedPosts() {
    return prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
    });
}

export async function getAdminPosts() {
    return prisma.post.findMany({
        orderBy: { updatedAt: 'desc' },
    });
}

export async function getPublishedPostBySlug(slug: string) {
    return prisma.post.findFirst({
        where: {
            slug,
            published: true,
        },
    });
}
//

export async function getPostById(id: number) {
    return prisma.post.findUnique({
        where: { id },
    });
}
