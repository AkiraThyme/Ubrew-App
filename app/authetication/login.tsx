import { StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View } from 'react-native'
import { useWarmUpBrowser } from '@/hooks/useWarmUpBrowser'
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useOAuth } from '@clerk/clerk-expo';
import { Stack, useRouter } from 'expo-router';
import React from 'react';

enum Strategy{
  Google = 'oauth_google',
  Facebook = 'oauth_facebook',
  Discord = 'oauth_discord',
  Apple ='oauth_instagram',
}


const login = () =>  {
    useWarmUpBrowser();
    const router = useRouter();
    const {startOAuthFlow: googleAuth} = useOAuth({strategy:'oauth_google'});
    const {startOAuthFlow: facebookAuth} = useOAuth({strategy:'oauth_facebook'});
    const {startOAuthFlow: discordAuth} = useOAuth({strategy:'oauth_discord'})
    const {startOAuthFlow: appleAuth} = useOAuth({strategy:'oauth_apple'})

    const onSelectAuth = async (strategy: Strategy) => {
      const selectedAuth = {
        [Strategy.Google]: googleAuth,
        [Strategy.Facebook]: facebookAuth,
        [Strategy.Discord]: discordAuth,
        [Strategy.Apple]: appleAuth,
      }[strategy];

      try{
        const { createdSessionId, setActive} = await selectedAuth()

        if(createdSessionId){
          setActive!({session: createdSessionId})
          
        }
      }catch (err){
        console.error('OAuth error:', err );
      }
    }

  return (
    <View style={styles.container}>
      <Text style={{textAlign: 'center', marginBottom: 15, fontSize: 30, fontFamily: 'SpaceMono'}}> Login </Text>
      <View style={styles.seperatorView}>
        
        <Text style={styles.seperator}></Text>
        <View style={{
          flex: 1,
          borderBottomColor: '#000',
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
        />
      </View>
      <TextInput
        autoCapitalize='none'
        placeholder='Email'
        style={[defaultStyles.inputField, {marginBottom: 30}]}
      />
      <TouchableOpacity style={defaultStyles.btn}>
        <Text style={defaultStyles.btnText}>Continue</Text>
      </TouchableOpacity>

      <View style={styles.seperatorView}>
        <View style={{
          flex: 1,
          borderBottomColor: '#000',
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
        />
        <Text style={styles.seperator}>or</Text>
        <View style={{
          flex: 1,
          borderBottomColor: '#000',
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
        />
      </View>
      <View style={{gap: 10}}>
        <TouchableOpacity style={styles.btnOutline} onPress={() => onSelectAuth(Strategy.Discord)}>
          <FontAwesome5 name='discord' size={20} style={defaultStyles.btnIcon} />
          <Text style={styles.btnOutlineText}>Continue with Discord</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnOutline} onPress={() => onSelectAuth(Strategy.Google)}>
          <AntDesign name='google' size={20} style={defaultStyles.btnIcon} />
          <Text style={styles.btnOutlineText}>Continue with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnOutline} onPress={() => onSelectAuth(Strategy.Facebook)}>
          <AntDesign name='facebook-square' size={20} style={defaultStyles.btnIcon} />
          <Text style={styles.btnOutlineText}>Continue with Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnOutline} onPress={() => onSelectAuth(Strategy.Apple)}>
          <AntDesign name='apple1' size={20} style={defaultStyles.btnIcon} />
          <Text style={styles.btnOutlineText}>Continue with Apple</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}


export default login

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: Colors.dirtywhite,
        padding: 26,
    },
    seperatorView:{
      flexDirection:'row',
      gap: 10,
      alignItems: 'center',
      marginVertical: 30,
    },
    seperator: {
      fontFamily:'SpaceMono',
      color: Colors.gray,
    },
    btnOutline: {
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: Colors.gray,
      height: 50,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      paddingHorizontal: 10,
    },
    btnOutlineText: {
      color: '#000',
      fontSize: 16,
      fontFamily: 'SpaceMono',
    },
})