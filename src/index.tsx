import * as React from "react";
import {
  ActivityIndicator,
  View,
  FlatList,
  ListRenderItem,
  StyleProp,
  ViewStyle,
  ListRenderItemInfo,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Insets,
  PointPropType
} from "react-native";

export interface Props<ItemT> {
  numColumns: number;
  style?: StyleProp<ViewStyle>;
  columnWrapperStyle?: StyleProp<ViewStyle>;
  data: ReadonlyArray<ItemT>;
  keyExtractor?: (item: ItemT, index: number) => string;
  renderItem: ListRenderItem<ItemT>;
  ListHeaderComponent?:
    | React.ComponentClass<any>
    | React.ReactElement<any>
    | (() => React.ReactElement<any>);
  ListEmptyComponent?:
    | React.ComponentClass<any>
    | React.ReactElement<any>
    | (() => React.ReactElement<any>);
  onRefresh?: (() => void);
  refreshing?: boolean;
  onEndReached?: ((info: { distanceFromEnd: number }) => void) | null;
  loadingMore?: boolean;
  removeClippedSubviews?: boolean;
  marginInternal?: number;
  marginExternal?: number;
  keyboardDismissMode?: "none" | "interactive" | "on-drag";
  onScroll?: (event?: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onScrollBeginDrag?: (event?: NativeSyntheticEvent<NativeScrollEvent>) => void;
  contentInset?: Insets;
  contentOffset?: PointPropType;
}

class DummyItem {}

export default class Grid<ItemT> extends React.Component<Props<ItemT>> {
  private onEndReachedCalledDuringMomentum: boolean;

  constructor(props: Props<ItemT>) {
    super(props);
    this.onEndReachedCalledDuringMomentum = false;
  }

  private renderItem(
    info: ListRenderItemInfo<ItemT>
  ): React.ReactElement<any> | null {
    const marginInternal = this.props.marginInternal || 0;
    const marginExternal = this.props.marginExternal || 0;
    let [marginTop, marginLeft, marginBottom, marginRight] = [0, 0, 0, 0];
    if (info.index < this.props.numColumns) {
      marginTop = marginExternal;
      marginBottom = marginInternal;
    } else if (this.props.data.length - info.index <= this.props.numColumns) {
      marginBottom = marginExternal;
    } else {
      marginBottom = marginInternal;
    }
    if (info.index % this.props.numColumns === 0) {
      marginLeft = marginExternal;
      marginRight = marginInternal;
    } else if (
      info.index %
      this.props.numColumns ===
      this.props.numColumns - 1
    ) {
      marginRight = marginExternal;
    } else {
      marginRight = marginInternal;
    }
    if (info.item instanceof DummyItem) {
      return (
        <View
          style={{ flex: 1, marginTop, marginLeft, marginBottom, marginRight }}
        />
      );
    } else {
      return (
        <View
          style={{ flex: 1, marginTop, marginLeft, marginBottom, marginRight }}
        >
          {this.props.renderItem(info)}
        </View>
      );
    }
  }

  private keyExtractor(item: ItemT | DummyItem, index: number): string {
    if (item instanceof DummyItem) {
      return `dummy-${index}`;
    } else if (this.props.keyExtractor) {
      return this.props.keyExtractor(item, index);
    } else {
      return index.toString();
    }
  }

  private onEndReached(info: { distanceFromEnd: number }) {
    if (!this.onEndReachedCalledDuringMomentum) {
      if (this.props.onEndReached) this.props.onEndReached(info);
      this.onEndReachedCalledDuringMomentum = true;
    }
  }

  private renderLoadingIndicator() {
    if (this.props.loadingMore) {
      return (
        <View style={{ paddingTop: 10, paddingBottom: 10 }}>
          <ActivityIndicator />
        </View>
      );
    } else {
      return null;
    }
  }

  render() {
    const paddedItems: (ItemT | DummyItem)[] = (() => {
      if (this.props.data === null) return [];
      const mod = this.props.data.length % this.props.numColumns;
      if (mod > 0) {
        const dummyItems = new Array(this.props.numColumns - mod).fill(
          new DummyItem()
        );
        return [...this.props.data, ...dummyItems];
      } else {
        return [...this.props.data];
      }
    })();

    return (
      <FlatList
        numColumns={this.props.numColumns}
        style={this.props.style}
        columnWrapperStyle={this.props.columnWrapperStyle}
        data={paddedItems}
        keyExtractor={this.keyExtractor.bind(this)}
        renderItem={this.renderItem.bind(this)}
        ListHeaderComponent={this.props.ListHeaderComponent}
        ListFooterComponent={this.renderLoadingIndicator.bind(this)}
        ListEmptyComponent={this.props.ListEmptyComponent}
        onRefresh={this.props.onRefresh}
        refreshing={this.props.refreshing}
        onEndReached={this.onEndReached.bind(this)}
        removeClippedSubviews={this.props.removeClippedSubviews}
        onEndReachedThreshold={0.5}
        onMomentumScrollBegin={() => {
          this.onEndReachedCalledDuringMomentum = false;
        }}
        keyboardDismissMode={this.props.keyboardDismissMode}
        onScroll={this.props.onScroll}
        onScrollBeginDrag={this.props.onScrollBeginDrag}
        contentInset={this.props.contentInset}
        contentOffset={this.props.contentOffset}
      />
    );
  }
}
