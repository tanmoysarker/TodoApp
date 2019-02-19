import React from 'react';
import { ScrollView, View, Text, TextInput, Button,FlatList, TouchableHighlight, Image} from 'react-native';
import firebase from './src/fbconfig'

class App extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = ({
      todoTasks: [],
      newTaskName: '',
      loading: false
    })
    this.ref = firebase.firestore().collection('todoTasks');
  }
  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot((querySnapshot) => {
      const todos = []
      querySnapshot.forEach((doc) => {
        todos.push({
          taskName: doc.data().taskName
        })
      })
      this.setState({
        todoTasks: todos.sort((a, b) => {
          return ( a.taskName < b.taskName)
        }),
        loading: false
      })
    })
  }
  onPressAdd = () => {
    firebase.firestore().collection("todoTasks").add({
      taskName: this.state.newTaskName
    }).then((data) => {
      console.log(`added data = ${data}`)
      this.setState({
        newTaskName: '',
        loading: true
      })
    }).catch((error) => {
      console.log(`error adding firestore document = ${error}`)
      this.setState({
        newTaskName: '',
        loading: true
      })
    })
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{
          backgroundColor: 'tomato',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
          height:64
        }}>
          <TextInput style={{
            height: 40,
            width: 200,
            margin: 10,
            padding: 10,
            borderColor: 'white',
            borderWidth: 1,
            color: 'white'
          }}
            keyboardType='default'
            placeholderTextColor='white'
            placeholder='Enter task name'
            onChangeText={
              (text) => {
                this.setState({ newTaskName: text })
              }
            }
          />
          <TouchableHighlight
            style={{ marginRight: 10 }}
            underlayColor='tomato'
            onPress={this.onPressAdd}
          >
          <Image
            style={{ width: 35, height: 35 }}
            source= {require('./src/add.png')}
          />
          </TouchableHighlight>
        </View>
        <FlatList
          data={this.state.todoTasks}
          renderItem={({ item, index }) => {
            return (
              <Text>{item.taskName}</Text>
            )
          }}
          keyExtractor={(item,index) => item.taskName}
        >
        </FlatList>

      </View>
    )
  }
}
export default App;

