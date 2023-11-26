import { COLORS } from '../../styles/Colors';
import { Entypo } from '@expo/vector-icons';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import React, {
  FC,
  ReactElement,
  RefObject,
  useEffect,
  useRef,
  useState
} from 'react';

type TDropdownOption = {
  label: string;
  value: string;
};

interface IDropdownCustomStyles {
  button?: {};
  dropdownList?: {};
  dropdownListItemValue?: {};
}

interface IProps {
  customStyles?: IDropdownCustomStyles;
  data: Array<{ label: string; value: string }>;
  defaultSelected?: TDropdownOption;
  label?: string;
  onSelect: (item: TDropdownOption) => void;
}

const Dropdown: FC<IProps> = ({
  customStyles,
  data,
  defaultSelected,
  label,
  onSelect
}) => {
  const buttonStyle = customStyles?.button || {};
  const dropdownListStyle = customStyles?.dropdownList || {};
  const dropdownListItemValueStyle = customStyles?.dropdownListItemValue || {};

  const [dropdownPos, setDropdownPos] = useState({ left: 0, top: 0 });
  const [selected, setSelected] = useState<TDropdownOption>();
  const [visible, setVisible] = useState(false);

  const dropdownButton: RefObject<TouchableOpacity> = useRef(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    setSelected(defaultSelected);
  }, [defaultSelected]);

  const hideDropdown = () => setVisible(false);

  const onItemPress = (item: TDropdownOption) => {
    setSelected(item);
    onSelect(item);
    setVisible(false);
  };

  const openDropdown = () => {
    positionDropdownList();
    setVisible(true);
  };

  const positionDropdownList = () =>
    dropdownButton.current?.measure(
      (
        _fx: number,
        _fy: number,
        _w: number,
        _h: number,
        px: number,
        py: number
      ) => {
        setDropdownPos({ top: py + 16, left: px });
      }
    );

  const renderDropdown = (): ReactElement<any, any> => {
    return (
      <Modal animationType="none" transparent visible={visible}>
        <TouchableOpacity onPress={hideDropdown} style={styles.overlay}>
          <View
            style={[
              styles.dropdownList,
              {
                left: dropdownPos.left,
                top: dropdownPos.top
              },
              dropdownListStyle
            ]}
          >
            <FlatList
              data={data}
              keyExtractor={({ value }) => value}
              renderItem={renderItem}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  const renderItem = ({
    item,
    index
  }: {
    item: TDropdownOption;
    index: number;
  }): ReactElement<any, any> => (
    <TouchableOpacity
      style={[
        styles.dropdownListItem,
        { borderBottomColor: index + 1 === data.length ? 'white' : '#efefef' }
      ]}
      onPress={() => onItemPress(item)}
    >
      <Text style={dropdownListItemValueStyle}>{item.label}</Text>
    </TouchableOpacity>
  );

  const toggleDropdown = () => {
    // this condition prevents flickering effect on the first render
    if (!visible && !wasOpen.current) {
      positionDropdownList();

      setTimeout(() => setVisible(true), 100);
      wasOpen.current = true;
    } else {
      visible ? setVisible(false) : openDropdown();
    }
  };

  return (
    <TouchableOpacity
      onPress={toggleDropdown}
      ref={dropdownButton}
      style={[styles.button, buttonStyle]}
    >
      <Text ellipsizeMode="tail" numberOfLines={2} style={styles.buttonText}>
        {selected?.label || label}
      </Text>
      <Entypo
        color={COLORS.BLACK_SHADE}
        name="chevron-up"
        size={16}
        style={[
          styles.chevronIcon,
          { transform: [{ rotate: visible ? '0deg' : '180deg' }] }
        ]}
      />
      {renderDropdown()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#efefef',
    borderRadius: 8,
    flexDirection: 'row',
    height: 40
  },
  buttonText: {
    flex: 4,
    marginLeft: 8,
    textAlign: 'center'
  },
  chevronIcon: {
    marginRight: 8
  },
  dropdownList: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 3,
    shadowColor: '#000000',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    width: '100%'
  },
  dropdownListItem: {
    alignItems: 'center',
    borderBottomWidth: 1,
    padding: 10,
    width: '100%'
  },
  overlay: {
    height: '100%',
    width: '100%'
  }
});

export default Dropdown;
