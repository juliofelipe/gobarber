import React, { useCallback, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  View,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';
import api from '../../services/api';
import Icon from 'react-native-vector-icons/Feather';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import getValidationErrors from '../../utils/getValidationErrors';

import Button from '../../components/Button';
import Input from '../../components/Input';

import {
  Container,
  Title,
  BackButton,
  UserAvatarButton,
  UserAvatar
} from './styles';
import { useAuth } from '../../hooks/auth';


interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const { user } = useAuth();

  const navigation = useNavigation();
  const formRef = useRef<FormHandles>(null);

  const emailInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  const handleSignUp = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().min(6, 'No mínimo 6 dígitos'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/users', data);

        Alert.alert (
          'Cadastro realizado com sucesso!',
          'Você já pode fazer ser logo no GoBarber.'
        )

        navigation.goBack()
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);

          return;
        }

        console.log(error);

        Alert.alert (
          'Erro no cadastro',
          'Ocorreu um erro ao fazer cadastro, tente novamente.'
        )
      }
    },
    [navigation],
  );

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [])


  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Container>
            <BackButton onPress={() => {}}>
              <Icon name="chevron-left" size={24} color="#999591" />
            </BackButton>

            <UserAvatarButton onPress={() => {}}>
              <UserAvatar source={{ uri: user.avatar_url }} />
            </UserAvatarButton>

            <View>
              <Title>Meu perfil</Title>
            </View>

            <Form ref={formRef} onSubmit={handleSignUp}>
              <Input

                autoCapitalize="words"
                name="name"
                icon="user"
                placeholder="Nome"
                onSubmitEditing={() => {
                  emailInputRef.current?.focus()
                }}
                />
              <Input
                ref={emailInputRef}
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  oldPasswordInputRef.current?.focus()
                }}
                />
              <Input
                ref={oldPasswordInputRef}
                secureTextEntry
                name="old_password"
                icon="lock"
                placeholder="Senha"
                textContentType="newPassword"
                returnKeyType="send"
                containerStyle={{ marginTop: 16}}
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus()
                }}
                />

              <Input
                ref={passwordInputRef}
                secureTextEntry
                name="password"
                icon="lock"
                placeholder="Nova Senha"
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => {
                  confirmPasswordInputRef.current ?.focus();
                }}
                />

              <Input
                ref={confirmPasswordInputRef}
                secureTextEntry
                name="password_confirmation"
                icon="lock"
                placeholder="Senha"
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => formRef.current?.submitForm()}
                />
            </Form>
            <Button
                onPress={() => {
                  formRef.current?.submitForm();
                }}
              >
                Confirmar mudanças
              </Button>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <BackToSignInButton onPress={() => navigation.navigate('SignIn')}>
        <Icon name="arrow-left" size={20} color="#fff" />
      </BackToSignInButton>
    </>
  );
};

export default SignUp;

