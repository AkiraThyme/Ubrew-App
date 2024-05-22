import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Linking, Image } from 'react-native';
import * as MailComposer from 'expo-mail-composer';
import { FontAwesome, Entypo, AntDesign } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const sendEmail = async () => {
    const isAvailable = await MailComposer.isAvailableAsync();
    if (isAvailable) {
      MailComposer.composeAsync({
        recipients: ['hello@arunravi.in'],
        subject: 'Contact Form Submission',
        body: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      })
      .then(result => {
        if (result.status === MailComposer.MailComposerStatus.SENT) {
          Alert.alert('Success', 'Email sent successfully');
        } else {
          Alert.alert('Error', 'Failed to send email');
        }
      })
      .catch(error => {
        Alert.alert('Error', error.message);
      });
    } else {
      Alert.alert('Error', 'Mail Composer is not available');
    }
  };

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } 
    // else {
    //   // If there's no screen to go back to, navigate to a specific screen
    //   router.push('/(usertabs)/usersettings'); // Replace '/home' with your desired screen
    // }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>
      <Image
        source={require('@/assets/images/ubrewcontactus.jpg')} // Replace with your image path
        style={styles.headerImage}
      />
      <View style={styles.formContainer}>
        <Text style={styles.header}>GET IN TOUCH!</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.textArea}
          placeholder="Message"
          multiline
          numberOfLines={4}
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.button} onPress={sendEmail}>
          <FontAwesome name="send-o" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.socialIcons}>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com')}>
          <Entypo name="instagram" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.dribbble.com')}>
          <Entypo name="dribbble" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.facebook.com/unclebrewbuhisan')}>
          <Entypo name="facebook" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ContactUs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  headerImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
  },
  formContainer: {
    width: '80%',
    height: '50%',
    backgroundColor: Colors.onebrown,
    borderRadius: 10,
    padding: 25,
    marginTop: 200,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  textArea: {
    width: '100%',
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#6200ee',
    borderRadius: 50,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: -30,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 100,
    width: '60%',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#fff',
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1,
  },
});
