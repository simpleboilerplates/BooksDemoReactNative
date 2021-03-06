/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
"use strict";


import React, {Component} from "react";
import {_get} from "../shared/api/server";
import bindAll, {basicState} from "../shared/util/Statehelper";
import {ActivityIndicator, FlatList, StyleSheet, View} from "react-native";
import {colors} from "../shared/constant/constant";
import {MyListItem} from "../view/myListItem";

export default class HomeScreen extends Component {
    static navigationOptions = {
        title: "Books"
    };

    constructor(props) {
        super(props);
        this.state = {
            ...basicState,
            data: []
        };
    }

    componentDidMount() {
        bindAll(this);
        this._getFood();
    }

    _getFood = async () => {
        let that = this;
        try {
            this.loading();
            let result = await _get(`books`);
            //console.log("_retrieveFood "+JSON.stringify(result));
            if (result) {
                that.notLoading();
                that.setState({
                    data: result
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    _keyExtractor = (item, index) => item.id;
    _onPressItem = (id: string) => {
        // updater functions are preferred for transactional updates
        this.setState((state) => {
            // copy the map rather than modifying state.
            const selected = new Map(state.selected);
            selected.set(id, !selected.get(id)); // toggle
            return {selected};
        });
    };
    _renderItem = ({item}) => (
        <MyListItem
            id={item.id}
            onPressItem={this._onPressItem}
            title={item.title}
        />
    );


    render() {
        console.log(JSON.stringify(this.state.data));
        if (this.state.loading) {
            return (
                <View style={styles.content}>
                    <ActivityIndicator size="large" color={colors.BLUE}/>
                </View>
            );
        } else {
            return (
                <View style={styles.listContainer}>
                    <FlatList
                        data={this.state.data}
                        extraData={this.state}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                    />
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    content: {
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        height: "100%",
        backgroundColor: colors.WHITE
    },

    listContainer: {
        display: "flex",
        backgroundColor: colors.WHITE,
        flex: 1,
        justifyContent: "space-between",
        alignItems: "stretch",
        marginTop: 30,
        padding: 16,
    }
});
