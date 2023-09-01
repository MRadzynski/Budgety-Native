import { COLORS } from '../../styles/Colors';
import { StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import CURRENCIES from '../../data/currencies.json';
import CustomButton from '../../components/CustomButton/CustomButton';
import CustomModal from '../../components/CustomModal/CustomModal';
import CustomTextInput from '../../components/CustomTextInput/CustomTextInput';
import Dropdown from '../../components/Dropdown/Dropdown';
import LANGUAGES from '../../data/languages.json';
import Title from '../../components/Title/Title';

interface IDrawerProps {
  navigation: any;
}

const SettingsScreen = ({ navigation }: IDrawerProps) => {
  const [isDeletedModalVisible, setIsDeletedModalVisible] = useState(false);
  const [isErasedModalVisible, setIsErasedModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <CustomModal
        isVisible={isErasedModalVisible}
        message="You are about to erase your data."
        onConfirm={() => console.log('erased')}
        setIsVisible={setIsErasedModalVisible}
      />
      <CustomModal
        isVisible={isDeletedModalVisible}
        message="You are about to delete your account."
        onConfirm={() => console.log('deleted')}
        setIsVisible={setIsDeletedModalVisible}
      />
      <Title customStyles={{ content: styles.titleContent }} text="Settings" />
      <View style={styles.sectionsContainer}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>User</Text>
          <View style={styles.sectionContentContainer}>
            <View style={styles.sectionItemContainer}>
              <Text style={styles.sectionItemTitle}>Display Name</Text>
              <CustomTextInput
                customStyles={{
                  content: styles.textInput,
                  container: styles.textInputContainer
                }}
                onChangeText={() => {}}
                placeholderText="John Doe"
                placeholderTextColor="#757575"
                selectionColor={COLORS.BLACK_SHADE}
              />
            </View>
          </View>
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.sectionContentContainer}>
            <View style={styles.sectionItemContainer}>
              <Text style={styles.sectionItemTitle}>Currency</Text>
              <Dropdown
                customStyles={{
                  button: styles.dropdownButton,
                  dropdownList: styles.dropdownList
                }}
                data={CURRENCIES}
                defaultSelected={CURRENCIES[0]}
                onSelect={() => null}
              />
            </View>
            <View style={styles.sectionItemContainer}>
              <Text style={styles.sectionItemTitle}>Language</Text>
              <Dropdown
                customStyles={{
                  button: styles.dropdownButton,
                  dropdownList: styles.dropdownList
                }}
                data={LANGUAGES}
                defaultSelected={LANGUAGES[0]}
                onSelect={() => null}
              />
            </View>
          </View>
        </View>
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, styles.sectionDangerZone]}>
            Danger Zone
          </Text>
          <View style={styles.sectionContentContainer}>
            <View style={styles.sectionItemContainer}>
              <Text>Erase balance</Text>
              <CustomButton
                customStyles={{
                  container: styles.dangerZoneButtonContainer,
                  textContent: styles.dangerZoneButtonContent
                }}
                onPress={() => setIsErasedModalVisible(true)}
                title="Erase"
              />
            </View>
            <View style={styles.sectionItemContainer}>
              <Text>Delete account</Text>
              <CustomButton
                customStyles={{
                  container: {
                    ...styles.dangerZoneButtonContainer,
                    backgroundColor: COLORS.ERROR
                  },
                  textContent: {
                    ...styles.dangerZoneButtonContent,
                    color: COLORS.WHITE_SHADE
                  }
                }}
                onPress={() => setIsDeletedModalVisible(true)}
                title="Delete"
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.PRIMARY,
    flex: 1,
    paddingBottom: 16,
    paddingHorizontal: 32
  },
  dangerZoneButtonContainer: {
    borderRadius: 8,
    elevation: 3,
    height: 40,
    justifyContent: 'center',
    paddingVertical: 6,
    width: 80
  },
  dangerZoneButtonContent: {
    fontSize: 16
  },
  dropdownButton: {
    backgroundColor: COLORS.LIGHT_GRAY,
    elevation: 3,
    width: 100
  },
  dropdownList: {
    height: '25%',
    width: 100
  },
  sectionContainer: {
    backgroundColor: COLORS.WHITE_SHADE,
    borderRadius: 8,
    elevation: 16,
    paddingHorizontal: 24,
    paddingVertical: 16
  },
  sectionContentContainer: {
    gap: 16,
    marginTop: 8
  },
  sectionDangerZone: {
    color: COLORS.ERROR
  },
  sectionItemContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  sectionItemTitle: {
    flex: 1
  },
  sectionTitle: {
    color: COLORS.BLACK_SHADE,
    fontSize: 24,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { height: 1, width: 1 },
    textShadowRadius: 1
  },
  sectionsContainer: {
    flex: 1,
    gap: 32,
    marginTop: 40
  },
  textInput: {
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: 8,
    color: COLORS.BLACK_SHADE,
    padding: 8,
    width: '75%'
  },
  textInputContainer: {
    alignItems: 'flex-end'
  },
  titleContent: {
    color: COLORS.WHITE_SHADE,
    fontSize: 32,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { height: 3, width: 3 },
    textShadowRadius: 1
  }
});

export default SettingsScreen;
