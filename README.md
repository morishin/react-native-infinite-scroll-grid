# react-native-infinite-scroll-grid
## Features
- Pull to refresh
- Scroll to load more
- Multi-column
    - Easy to set internal/external margins of grid
    - Avoid FlatList's layout bug that sets wrong width to the last row item (cf. [stackoverflow](https://stackoverflow.com/questions/43502954/react-native-flatlist-with-columns-last-item-width?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa))

<img src="https://user-images.githubusercontent.com/1413408/41037130-49a1731c-69cd-11e8-9220-da22d7de7914.gif" width="320"/>

2 column | 3 column
--- | ---
<img src="https://user-images.githubusercontent.com/1413408/41037129-497a08cc-69cd-11e8-8f03-946ae425be47.gif" width="320"/> | <img src="https://user-images.githubusercontent.com/1413408/41037128-494fbbe4-69cd-11e8-9473-39d00382eb31.gif" width="320"/>

## Usage
Similar to FlatList.

### example
```js
<Grid
  numColumns={3}
  data={this.state.data}
  keyExtractor={item => item.id.toString()}
  renderItem={info => this.renderItem(info)}
  onRefresh={() => this.onRefresh()}
  refreshing={this.state.refreshing}
  onEndReached={() => this.onEndReached()}
  loadingMore={this.state.loadingMore}
  marginExternal={4}
  marginInternal={4}
/>
```
For details, see [demo](https://github.com/morishin/react-native-infinite-scroll-grid/tree/master/demo) directory.

## Development
### How to run demo application
```sh
git clone git@github.com:morishin/react-native-infinite-scroll-grid.git
cd react-native-infinite-scroll-grid
yarn install
yarn run build-for-demo:watch
cd demo
yarn install
yarn run start
```

After the above steps, you can launch demo app on your device via expo. The app reloads automatically when the source code has changed.
