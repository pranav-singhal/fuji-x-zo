import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getPhotos() {



    const { data: buckets, error: bucketsError } = await supabase
        .storage
        .listBuckets()

    console.log({ buckets, bucketsError, supabaseUrl, supabaseAnonKey })

    const { data: files, error } = await supabase
        .storage
        .from('fuji-x-photos-v1')
        .list()

    console.log({ files, error })

    if (error) {
        console.error('Error fetching photos:', error)
        return []
    }

    console.log({ files })

    return files
        .filter(file => file.name.match(/\.(jpg|jpeg|png|gif)$/i))
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
} 