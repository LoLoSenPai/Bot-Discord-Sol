'use strict'


import * as fs from "fs";

interface metadata_info_type {
    metadata: {
        name: string
        image: string
        attributes: Array<{
            trait_type: string,
            value: string
        }>
    }
}

interface trait_type {
    name: string
    values: Array<string>,
    max_repetitions: number
}

interface collection_item_type {
    name: string
    image: string
    attributes: Array<{
        trait_type: string
        value: string | null
    }>
    absolute_rank?: number
}

const collection: Array<metadata_info_type> = require('./rekt-dogs.json')

const TOTAL_NFTS = collection.length

// Step 1: Find maximum shape of the data

let trait_shape: Array<trait_type> = []

for(let nft of collection) {
    // We store a single NFT shape here, we will push it later
    let single_nft_shape: Array<trait_type> = []
    // We track each NFT index
    const current_nft_index = collection.findIndex(item => item.metadata.name === nft.metadata.name)

    // Define a shape for a single NFT
    let nft_attribute_index = 0
    for(let attribute of nft.metadata.attributes) {
        const attribute_index = single_nft_shape.findIndex(value => value.name === attribute.trait_type)

        //If single NFT already has a specified trait
        if(attribute_index !== -1) {
            single_nft_shape[attribute_index].max_repetitions += 1
            /*
            If there are more of a single trait, make sure to include the other value as well

            This part of the code merges 2 duplicate trait types, so that values remain the same
            this is a philosophical question, for now I've decided that every other instance of
            the same value type is a separate type with separate values, instead of combining them

            if(!single_nft_shape[attribute_index].values.includes(attribute.value))
                single_nft_shape[attribute_index].values.push(attribute.value)
             */
            single_nft_shape.push({
                name: `${attribute.trait_type}:${single_nft_shape[attribute_index].max_repetitions}`,
                values: [attribute.value],
                max_repetitions: 1
            })
            collection[current_nft_index].metadata.attributes[nft_attribute_index].trait_type = `${attribute.trait_type}:${single_nft_shape[attribute_index].max_repetitions}`
            nft_attribute_index += 1
            continue
        }

        // Create a trait if it doesn't exist
        single_nft_shape.push({
            name: attribute.trait_type,
            values: [attribute.value],
            max_repetitions: 1
        })
        nft_attribute_index += 1
    }

    /* After we've defined the final shape for that particular NFT
        we go through every trait from that shape and add it to our "global"
        shape defined at the top of the loop
     */
    for(let trait of single_nft_shape) {
        const index = trait_shape.findIndex(item => item.name === trait.name)
        // If there's no index, aka trait is not in the shape, we update it it
        if(index !== -1) {
            if(trait_shape[index].max_repetitions < trait.max_repetitions)
                trait_shape[index].max_repetitions = trait.max_repetitions
            trait.values.forEach(value => {
                if(!trait_shape[index].values.includes(value))
                    trait_shape[index].values.push(value)
            })
            continue
        }
        // Otherwise, we add it
        trait_shape.push(trait)
    }
}

// Step 2: Injecting 'null' to missing values

let shaped_nft_collection: Array<collection_item_type> = []

for (let nft of collection) {
    const assigned_attributes = nft.metadata.attributes.map(item => item.trait_type)
    let shaped_nft_object: collection_item_type = {
        name: nft.metadata.name,
        image: nft.metadata.image,
        attributes: [...nft.metadata.attributes]
    }
    for (let shape_attribute of trait_shape) {
        if (!assigned_attributes.includes(shape_attribute.name))
            shaped_nft_object.attributes.push({
                trait_type: shape_attribute.name,
                value: 'null'
            })
    }

    shaped_nft_collection.push(shaped_nft_object)
}

// Step 2.1 , counting all repetitions

interface value_repetition_type {
    trait_type: string
    value: string | null
    total_repetitions: number
}

let value_repetition: Array<value_repetition_type> = []

for (let nft of shaped_nft_collection) {
    for (let attribute of nft.attributes) {
        const value_index = value_repetition.findIndex(item => item.trait_type === attribute.trait_type && item.value === attribute.value)
        if(value_index === -1) {
            value_repetition.push({...attribute, total_repetitions: 1})
            continue
        }
        value_repetition[value_index].total_repetitions += 1
    }
}

// Step 3: Calculate absolute rank

for (let nft_index in shaped_nft_collection) {
    let absolute_percentage: number = 1
    for (let attribute of shaped_nft_collection[nft_index].attributes) {
        const repetition = value_repetition.find(item => item.trait_type === attribute.trait_type && item.value === attribute.value)
        if (repetition)
            absolute_percentage = absolute_percentage * (repetition.total_repetitions / TOTAL_NFTS)
    }
    shaped_nft_collection[nft_index].absolute_rank = absolute_percentage
}

shaped_nft_collection.sort((a, b) => {
    if(a.absolute_rank && b.absolute_rank)
        return a.absolute_rank - b.absolute_rank
    return 0
})

fs.writeFileSync('./sorted_collection.json', JSON.stringify(shaped_nft_collection))
console.log("Done! Your sorted collection can be found inside 'sorted_collection.json' in this directory.")