import React, { Component } from 'react'
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native'
import CustomButton from './src/components/CustomButton'
import Display from './src/components/Display'

const initialState = {
  displayValue: '0',
  clearDisplay: false,
  operation: null,
  values: [0, 0],
  current: 0
}

export default class App extends Component {

  state = {...initialState}
    
  addDigit = n => {
    
    // limpar a tela se o tiver 0 no display (não é permitido ex: 08) ou se a propriedade ja estiver setada
    const clearDisplay = this.state.displayValue == '0' || this.state.clearDisplay 
    
    //não permite dois . seguidos
    if (n == '.' && !clearDisplay && this.state.displayValue.includes('.')) {
      return
    }
    // se limpar a tela estiver setado o valor atual é vazio, se não é o proprio valor da tela
    const currentValue = clearDisplay ? '' : this.state.displayValue
    // valor da tela é o atual concatenado com o digitado agora
    const displayValue = currentValue + n
    this.setState({ displayValue, clearDisplay: false})

    if (n !== '.'){
      const newValue = parseFloat(displayValue)
      // garante que um clone seja criado não uma referência
      const values = [...this.state.values]
      values[this.state.current] = newValue
      this.setState({values})

    }
  }

  clearMemory = () => {
      this.setState({...initialState})
  }

  setOperation = operation => {
    // só o primeiro operando
    if (this.state.current === 0){
      //atualiza indice do array, seta a operacao e limpa display
      this.setState({ operation, current: 1, clearDisplay: true})
    } else { // dois operandos
      const equals = operation === '='
      const values = [...this.state.values]
      try {
        // eval avalia/executa a expressao e guarda o resultado no indice 0
        values[0] = eval(`${values[0]} ${this.state.operation} ${values[1]}`)

      } catch (e){
        values[0] = this.state.values[0]
      }

      //indice 1 fica pronto para receber um segundo operando novamente
      values[1] = 0
      this.setState({
          displayValue: `${values[0]}`,
          operation: equals ? null : operation,
          current:  equals ? 0 : 1,
          clearDisplay: !equals,
          values
      })

    }
  }

  render(){
    return (
        <View style={styles.container}>
          <Display value={this.state.displayValue}></Display>
            <View style={styles.buttons}>
              <CustomButton label='AC' triple onClick={this.clearMemory}/>
              <CustomButton label='/' operation onClick={this.setOperation}/>
              <CustomButton label='7' onClick={this.addDigit}/>
              <CustomButton label='8' onClick={this.addDigit}/>
              <CustomButton label='9' onClick={this.addDigit}/>
              <CustomButton label='*' operation onClick={this.setOperation}/>
              <CustomButton label='4' onClick={this.addDigit}/>
              <CustomButton label='5' onClick={this.addDigit}/>
              <CustomButton label='6' onClick={this.addDigit}/>
              <CustomButton label='-' operation onClick={this.setOperation}/>
              <CustomButton label='1' onClick={this.addDigit}/>
              <CustomButton label='2' onClick={this.addDigit}/>
              <CustomButton label='3' onClick={this.addDigit}/>
              <CustomButton label='+' operation onClick={this.setOperation}/>
              <CustomButton label='0' double onClick={this.addDigit}/>
              <CustomButton label='.' onClick={this.addDigit}/> 
              <CustomButton label='=' operation onClick={this.setOperation}/>
            </View>
        </View>
    )
  }   
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
})
