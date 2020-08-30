import React from 'react';
import Icon from 'react-native-vector-icons/Feather'

import { Container, Title, Description, OkButton, OkButton } from './styles';

const AppointmentCreated: React.FC = () => {
  return (
  <Container>
    <Icon name="check" size={80} color="#04d361" />

    <Title>Agendamento concluído</Title>
    <Description>Terça, dia 14 de março de 2020 às 12:00h com Diego Fernandes</Description>

    <OkButton onPress={() => {}}>
      <OkButtonText>Ok</OkButtonText>
    </OkButton>
  </Container>
  );
};

export default AppointmentCreated;
