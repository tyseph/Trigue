import React, { Component } from "react";
import { Button, Text, View, FlatList, StyleSheet } from "react-native";

import auth from "@react-native-firebase/auth";

import firestore from "@react-native-firebase/firestore";

import CardStack, { Card } from "react-native-card-stack-swiper";

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

		firestore()
			.collection("Data")
			.onSnapshot((querySnapshot) => {
				const list = [];
				querySnapshot.forEach((doc) => {
					const { title, description, color } = doc.data();
					list.push({
						id: doc.id,
						title,
						description,
						color
					});
					this.setState({
						menu: list,
					});
				});
			});
	}

	print = () => {
		firestore()
			.collection("Data")
			.add({
				title: "Sajal",
				description: "I created this colour also",
				color: "red"
			})
			.then(() => {
				console.log("Updated successfully");
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
		const lapsList = this.state.menu.map((menu) => {
			return (
				<Card style={{ backgroundColor: "red", width: 370, height: 400, borderRadius: 25 }} key={menu.id}>
					<View>
						<Text
							
							style={{
								fontSize: 50,
								textAlign: "center",
								fontWeight: '700',
							}}
						>
							{menu.title}{' '}
							{menu.color}
						</Text>
						<Text
							
							style={{
								fontSize: 25,
								marginTop: 20,
								textAlign: "center",
								fontWeight: '700',
							}}
						>
							{menu.description}
						</Text>
					</View>
				</Card>
			);
		});

		return (
			<View style={{ flex: 1 }}>
				<Text style={{ fontSize: 25, fontWeight: "bold", textAlign: "center" }}>
					{this.state.name}
				</Text>
				{/* <FlatList
					data={this.state.menu}
					keyExtractor={(elem) => elem.id}
					renderItem={(elem) => (
						<View>
							<Text>{elem.item.title}</Text>
							<Text>{elem.item.description}</Text>
						</View>
					)}
				/> */}

				<CardStack
					data={this.state.menu}
					key={this.state.menu}
					style={{
						flex: 1,
						justifyContent: "center",
						alignSelf: "center",
						alignItems: "center",
						width: "100%",
					}}
					loop={true}
				>
					{lapsList}
				</CardStack>
				<Button title="Logout" onPress={this.onLogout} />
				<Button title="print" onPress={this.print} />
			</View>
		);
	}
}
