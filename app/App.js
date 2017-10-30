import React, { Component } from 'react';
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PanResponder
} from 'react-native';
import Camera from 'react-native-camera';
import base64 from 'base-64'

export default class Pr0c4st1n4t0r extends Component {
  constructor(props) {
    super(props);
    this.onQr = this.onQr.bind(this)
    this.doLeftClick = this.doLeftClick.bind(this)
    this.doRightClick = this.doRightClick.bind(this)
    this.state = {
      readed: false
    }
    this.ws = null
  } 


  doLeftClick(){
    this.ws.send(JSON.stringify({type: 'lclick'}))
  }

  doRightClick(){
    this.ws.send(JSON.stringify({type: 'rclick'}))
  } 



  onQr(result){
    this.setState({readed: true});

    const qrdata = JSON.parse(base64.decode(result.data))
    this.ws = new WebSocket(`ws://${qrdata.ip}:${qrdata.port}`,"echo-protocol")
    this.ws.onopen = () => {
    };

    this.ws.onmessage = (e) => {
      console.log(e.data);
    };

    this.ws.onerror = (e) => {
      console.log(e.message);
    };

    this.ws.onclose = (e) => {
      console.log(e.code, e.reason);
    };
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({

      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        var data = {type: "domove"}
        this.ws.send(JSON.stringify(data))
      },
      onPanResponderMove: (evt, gestureState) => {
        var data = {}
        data.type = "move"
        data.dx = gestureState.dx
        data.dy = gestureState.dy
        this.ws.send(JSON.stringify(data))
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        var data = {type: "notmove"}
        this.ws.send(JSON.stringify(data))
      },
      onPanResponderTerminate: (evt, gestureState) => {
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        return true;
      },
    });
  }


  render() {
    return (
      <View style={styles.container}>
      {!this.state.readed &&
        <Camera
          ref="cam"
          style={styles.camera}
          aspect={Camera.constants.Aspect.fill}
          onBarCodeRead={this.onQr}
          barCodeTypes={['qr']} />
      }
      {!!this.state.readed &&
        <View style={styles.main}>
          <View style={styles.controls}>
            <View style={styles.trackpad} {...this._panResponder.panHandlers}>
            </View>
            <View style={styles.buttons}>
              <TouchableOpacity onPress={this.doLeftClick} style={styles.ctrlbutton}></TouchableOpacity>
              <TouchableOpacity onPress={this.doRightClick} style={styles.ctrlbutton}></TouchableOpacity>
            </View>
          </View>
          <View style={styles.mode}></View>
        </View>
      }
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  main: {
    backgroundColor: "#FAFAFA",
    flex: 1,
    flexDirection: "row"
  },
  controls: {
    flex: 1,
    flexDirection: "column"
  },
  trackpad: {
    backgroundColor: "#CFD8DC",
    flex: 1 
  },
  buttons: {
    height: 100,
    flexDirection: "row"
  },
  ctrlbutton: {
    backgroundColor: "#607D8B",
    flex: 1
  },
  mode: {
    backgroundColor: "black",
    width: 100
  }
});
