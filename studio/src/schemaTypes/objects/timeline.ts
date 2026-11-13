import {defineField, defineType} from 'sanity'
import {TimelineIcon} from '@sanity/icons'

export const timeline = defineType({
  name: 'timeline',
  title: 'Timeline',
  type: 'object',
  icon: TimelineIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
    }),
    defineField({
      name: 'items',
      title: 'Timeline Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'month',
              title: 'Month',
              type: 'string',
              placeholder: 'e.g. March',
            }),
            defineField({
              name: 'year',
              title: 'Year',
              type: 'string',
              validation: (Rule) => Rule.required(),
              placeholder: 'e.g. 2022',
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
            }),
          ],
          preview: {
            select: {
              title: 'title',
              month: 'month',
              year: 'year',
            },
            prepare({title, month, year}) {
              const date = [month, year].filter(Boolean).join(' ')
              return {
                title: title || 'Untitled',
                subtitle: date || 'No date',
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
      items: 'items',
    },
    prepare({heading, items}) {
      return {
        title: heading || 'Timeline',
        subtitle: items ? `${items.length} item${items.length === 1 ? '' : 's'}` : 'No items',
      }
    },
  },
})
