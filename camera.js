import React from 'react';
import { View , Button , Image , Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permission from 'expo-permissions';

export default class PickImage extends React.Component{

    constructor(){
        super()
        this.state = {
            image: null,
        }
    }

    componentDidMount(){
        this.askPermission
    }

    askPermission = async() => {
        if(Platform.OS !== 'web'){
            const {status} = await Permissions.askAsync(Permission.CAMERA_ROLL)
            if(status !== 'granted'){
                alert('Sorry, camera roll permission is required')
            }
        }
    }

    _pickImage = async() => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaType: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4,3],
                quality: 1    
            });

            if(!result.cancelled){
                this.setState({image: result.data});
                this.uploadImage(result.uri);
            }

        } catch (error) {
            console.log(error)
        }
    }

    uploadImage = async(uri) => {
        const data = new FormData();
        let fileName = uri.split('/')[uri.split('/').length - 1];
        let type = `image/${uri.split('.')[uri.split('.').length - 1]}`;
        const fileToUpload = {
            uri: uri,
            name: fileName,
            type: type
        };
        data.append("digit"  , fileToUpload);
        fetch("" , {
            method: "POST",
            body: data,
            headers: {
                "Content-type": "multipart/form-data"
            }
        })
        .then((response) => response.json())
        .then((result) => {
            console.log("Success")
        }).catch((err) => {
            console.log("ERROR: " + err)
        })
    }

    render() {
        
        let {image} = this.state.image()
        return(
            <View>
                <Button title="Click Me" onPress={this._pickImage}></Button>
            </View>
        )
    }



}
