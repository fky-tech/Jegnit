import { getSupabaseAdmin } from './src/utils/supabase-admin';

async function seedColors() {
    const supabase = getSupabaseAdmin();
    console.log("Seeding colors...");

    const { data: products, error: fetchError } = await supabase.from('products').select('id');
    if (fetchError) {
        console.error("Fetch Error:", fetchError);
        return;
    }

    const colors = [
        { name: "Red", img: "" },
        { name: "Green", img: "" },
        { name: "Pink", img: "" },
        { name: "Yellow", img: "" }
    ];

    for (const product of (products || [])) {
        const { error: updateError } = await supabase
            .from('products')
            .update({ colors: colors })
            .eq('id', product.id);

        if (updateError) {
            console.error(`Update Error for ID ${product.id}:`, updateError);
        } else {
            console.log(`Updated ID ${product.id} with colors.`);
        }
    }
    console.log("Done seeding colors.");
}

seedColors();
