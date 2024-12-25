import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getPhotos() {
    try {
        let allFiles: any[] = []
        let offset = 0
        const limit = 1000 // Maximum allowed by Supabase per request

        while (true) {
            const { data: files, error } = await supabase
                .storage
                .from('fuji-x-photos-v1')
                .list('', {
                    limit: limit,
                    offset: offset,
                    sortBy: { column: 'name', order: 'asc' }
                })

            if (error) {
                console.error('Error fetching photos:', error)
                break
            }

            if (!files || files.length === 0) {
                break
            }

            allFiles = [...allFiles, ...files]

            if (files.length < limit) {
                break
            }

            offset += limit
        }

        return allFiles
            .filter(file => file.name.match(/\.(jpg|jpeg|png|gif|HEIC)$/i))
            .map(file => {
                const { data: { publicUrl } } = supabase
                    .storage
                    .from('fuji-x-photos-v1')
                    .getPublicUrl(file.name)

                return {
                    name: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension from display name
                    url: publicUrl
                }
            })
    } catch (error) {
        console.error('Error in getPhotos:', error)
        return []
    }
} 