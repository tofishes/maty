npm version patch
git add --all
git commit -m 'update version'
git push --follow-tags
npm publish --registry=https://registry.npmjs.org/
