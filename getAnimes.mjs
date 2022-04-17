import { GraphQLClient, gql } from 'graphql-request'
import fs from 'fs'
import shuffle from 'shuffle-array'

async function main() {
  const endpoint = 'https://graphql.anilist.co/'

  const graphQLClient = new GraphQLClient(endpoint, {})

  let animeList = []

  for (let i = 1; i <= 20; i++) {
    let query = gql`
      {
        Page(page: ${i}, perPage: 50) {
          media(
            sort: POPULARITY_DESC
            type: ANIME
            format_in: [TV, TV_SHORT, MOVIE, ONA]
          ) {
            id
            title {
              romaji
              english
            }
            genres
            season
            seasonYear
            startDate {
              month
              year
            }
            studios(isMain: true) {
              edges {
                node {
                  name
                }
              }
            }
            characters(sort: [ROLE, RELEVANCE, ID], perPage: 1, role: MAIN) {
              edges {
                node {
                  name {
                    full
                  }
                }
              }
            }
            coverImage {
              extraLarge
            }
            description
          }
        }
      }
    `

    let data = await graphQLClient.request(query)
    //console.log(JSON.stringify(data, undefined, 2))
    console.log(data.Page.media.length)
    animeList = animeList.concat(data.Page.media)
    console.log(animeList.length)
  }
  shuffle(animeList)
  fs.writeFileSync('animes.json', JSON.stringify(animeList, null, 2))
}

main().catch((error) => console.error(error))
