import * as React from "react";
import { Text, View, Image } from "react-native";
import { ButtonGroup } from "react-native-elements";
import Grid from "./react-native-infinite-scroll-grid";
import { ListRenderItemInfo } from "react-native";

interface Props {}

interface State {
  loadingMore: boolean;
  refreshing: boolean;
  posts: Post[];
  nextPage: number;
  numColumns: number;
}

interface Post {
  id: number;
  title: string;
  thumbnailUrl: string;
}

export default class Main extends React.Component<Props, State> {
  private isLoading: boolean = false;

  constructor(props: Props) {
    super(props);
    this.state = {
      loadingMore: false,
      refreshing: false,
      posts: [],
      nextPage: 1,
      numColumns: 1
    };
  }

  componentDidMount() {
    this.loadData(true);
  }

  private onRefresh() {
    this.loadData(true);
  }

  private onEndReached() {
    this.loadData(false);
  }

  private async fetchPosts(
    page: number,
    perPage: number = 20
  ): Promise<[Post]> {
    const posts = await fetch(
      `http://jsonplaceholder.typicode.com/photos?_page=${page}&_limit=${perPage}`
    ).then(response => response.json());
    return posts;
  }

  private async loadData(refresh: boolean) {
    if (this.isLoading) return;

    if (refresh) {
      this.setState({ refreshing: true });
    } else {
      this.setState({ loadingMore: true });
    }

    try {
      this.isLoading = true;
      const posts = await this.fetchPosts(this.state.nextPage);
      this.setState(previousState => {
        return {
          loadingMore: false,
          posts: refresh ? posts : previousState.posts.concat(posts),
          nextPage: previousState.nextPage + 1
        };
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
      this.setState({ loadingMore: false, refreshing: false });
    }
  }

  private renderItem(info: ListRenderItemInfo<Post>) {
    if (this.state.numColumns === 1) {
      return (
        <View
          style={{
            flexDirection: "row",
            height: 70,
            padding: 4
          }}
        >
          <Image
            source={{ uri: info.item.thumbnailUrl }}
            style={{ aspectRatio: 1, borderRadius: 8 }}
          />
          <Text style={{ flex: 1, marginLeft: 4 }}>{info.item.title}</Text>
        </View>
      );
    } else {
      return (
        <View
          style={{
            aspectRatio: 0.618,
            padding: 4
          }}
        >
          <Image
            source={{ uri: info.item.thumbnailUrl }}
            style={{ aspectRatio: 1, borderRadius: 8 }}
          />
          <Text style={{ flex: 1, marginLeft: 4 }}>{info.item.title}</Text>
        </View>
      );
    }
  }

  render() {
    return (
      <View style={{ flex: 1, paddingTop: 20 }}>
        <ButtonGroup
          selectedIndex={this.state.numColumns - 1}
          onPress={selectedIndex =>
            this.setState({ numColumns: selectedIndex + 1 })
          }
          buttons={["1", "2", "3"]}
        />
        <Grid
          style={{ flex: 1 }}
          key={this.state.numColumns}
          numColumns={this.state.numColumns}
          data={this.state.posts}
          keyExtractor={item => item.id.toString()}
          renderItem={info => this.renderItem(info)}
          onRefresh={() => this.onRefresh()}
          refreshing={this.state.refreshing}
          onEndReached={() => this.onEndReached()}
          loadingMore={this.state.loadingMore}
          marginExternal={4}
          marginInternal={4}
        />
      </View>
    );
  }
}
