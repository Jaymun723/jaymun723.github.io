import path from "path"
import { createFilePath } from "gatsby-source-filesystem"
import _ from "lodash"
import type { GatsbyNode } from "gatsby"

// Define the template for blog post
const blogPost = path.resolve(`./src/templates/blog-post.tsx`)
const aboutPage = path.resolve(`./src/templates/about-page.tsx`)
const tagTemplate = path.resolve("src/templates/tags.tsx")

export const createPages: GatsbyNode["createPages"] = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  // Get all markdown blog posts sorted by date
  const result: any = await graphql(`
    {
      allMarkdownRemark(sort: { frontmatter: { date: ASC } }, limit: 1000) {
        nodes {
          id
          fields {
            slug
            collection
          }
          frontmatter {
            tags
          }
        }
      }
      tagsGroup: allMarkdownRemark(
        filter: { fields: { collection: { eq: "blog" } } }
        limit: 2000
      ) {
        group(field: { frontmatter: { tags: SELECT } }) {
          fieldValue
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    )
    return
  }

  const allMarkdownNodes = result.data.allMarkdownRemark.nodes
  const posts = allMarkdownNodes.filter((node: any) => node.fields.collection === "blog")
  const pages = allMarkdownNodes.filter((node: any) => node.fields.collection === "about")

  // Create blog posts pages
  if (posts.length > 0) {
    posts.forEach((post: any, index: number) => {
      const previousPostId = index === 0 ? null : posts[index - 1].id
      const nextPostId = index === posts.length - 1 ? null : posts[index + 1].id

      createPage({
        path: post.fields.slug,
        component: blogPost,
        context: {
          id: post.id,
          previousPostId,
          nextPostId,
        },
      })
    })
  }

  // Create other pages
  if (pages.length > 0) {
    pages.forEach((page: any) => {
      createPage({
        path: page.fields.slug,
        component: aboutPage,
        context: {
          id: page.id,
        },
      })
    })
  }

  // Extract tag data from query
  const tags = result.data.tagsGroup.group

  // Make tag pages
  tags.forEach((tag: any) => {
    createPage({
      path: `/tags/${_.kebabCase(tag.fieldValue)}/`,
      component: tagTemplate,
      context: {
        tag: tag.fieldValue,
      },
    })
  })
}

export const onCreateNode: GatsbyNode["onCreateNode"] = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const parent = getNode(node.parent!)
    const collection = parent && parent.internal.type === `File` ? (parent as any).sourceInstanceName : null

    createNodeField({
      name: `collection`,
      node,
      value: collection,
    })

    let value = createFilePath({ node, getNode })
    
    if (collection === "about") {
      value = "/about/"
    }

    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] = ({ actions }) => {
  const { createTypes } = actions

  // Explicitly define the siteMetadata {} object
  // Also explicitly define the Markdown frontmatter
  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
      tags: [String]
    }

    type Fields {
      slug: String
      collection: String
    }
  `)
}
