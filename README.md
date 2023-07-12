# Kontent CLI migrations examples

Prismic Articles

1. Perform GraphiQL query against prismic at ouhelpcentre.prismic.io
2. Copy Json result file into data/testArticle.json
3. npm run migrate 200_HC_Article_Migration



# What's not covered.
1. Links to internal documents will not be generated.
2. Embedded styling ie. <strong>....<em>...</em>....</strong>
3. Assumed no formatting in quote citations and only one paragraph.



# Prismic GraphiQL Query used:

https://ouhelpcentre.prismic.io/graphql
