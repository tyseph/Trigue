import React, { Component } from "react";
import { Button, Text, View, FlatList } from "react-native";

import auth from "@react-native-firebase/auth";

import firestore from "@react-native-firebase/firestore";

export default class Home extends Component {
	constructor() {
		super();
		this.state = {
			name: "",
			menu: [],
		};
	}

	async componentDidMount() {
		await auth().onAuthStateChanged(async (user) => {
			if (user) {
				let userName = user.email;
				userName = userName.split("@");
				this.setState({
					name: userName[0],
				});
			} else {
				this.props.navigation.navigate("Login");
			}
		});

		// firestore().collection("Data").doc('test')
		// .set({
		//         title: "StartUp",
		//         description: "This is how you make an MVP",
		// })
		// .then(() => {
		//         console.log("Updated successfully");
		// })
	}

	print = () => {
		firestore()
			.collection("Data")
			.onSnapshot((querySnapshot) => {
				const list = [];
				querySnapshot.forEach((doc) => {
					const { title, description } = doc.data();
					list.push({
						id: doc.id,
						title,
						description,
					});
					this.setState({
						menu: list,
					});
				});
			});
	};

	onLogout = () => {
		auth()
			.signOut()
			.then(() => {
				window.alert("Logged out");
				this.props.navigation.navigate("Home");
			});
	};

	render() {
		return (
			<View>
				<Text style={{ fontSize: 25, fontWeight: "bold", textAlign: "center" }}>
					{this.state.name}
				</Text>
				<FlatList
					data={this.state.menu}
					keyExtractor={(elem) => elem.id}
					renderItem={(elem) => (
						<View>
							<Text>{elem.item.title}</Text>
							<Text>{elem.item.description}</Text>
						</View>
					)}
				/>
				<Button title="Logout" onPress={this.onLogout} />
				<Button title="print" onPress={this.print} />
			</View>
		);
	}
}
