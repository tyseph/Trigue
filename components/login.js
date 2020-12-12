import React, { Component } from "react";
import { Button, Text, View, TextInput } from "react-native";

import auth from "@react-native-firebase/auth";



export default class Login extends Component {
	constructor() {
		super();
		this.state = {
			email: "",
			password: "",
		};
	}

	onSubmit = () => {
		if (this.state.email === "" || this.state.password == "") {
			window.alert("Please Enter your credentials");
		} else {
			auth()
				.signInWithEmailAndPassword(this.state.email, this.state.password)
				.then(() => {
					console.log("User account created & signed in!");
				})
				.catch((error) => {
					if (error.code === "auth/invalid-email") {
						console.log("That email address is invalid!");
					}

					console.error(error);
				});
		}
        };
        
        async componentDidMount() {
                auth().onAuthStateChanged(async (user) => {
			if (user) {
				this.props.navigation.navigate('Home');
			}
		});
        }
                  
	render() {
		return (
			<View style={{ flex: 1, justifyContent: "center" }}>
				<Text style={{ fontSize: 70, fontWeight: "bold", textAlign: "center" }}>
					Login
				</Text>
				<TextInput
					style={{ fontSize: 30 }}
					value={this.state.email}
					placeholder="email"
					onChangeText={(value) => {
						this.setState({ email: value });
					}}
				/>
				<TextInput
					style={{ fontSize: 30 }}
					value={this.state.password}
					placeholder="password"
					onChangeText={(value) => {
						this.setState({ password: value });
					}}
				/>
				<Button
					title="submit"
					onPress={this.onSubmit}
				/>
				<Button
					title="Go to Register"
					onPress={() => this.props.navigation.navigate("Register")}
				/>
			</View>
		)}
	}
