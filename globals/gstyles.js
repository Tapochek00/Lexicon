import {Dimensions, StyleSheet} from 'react-native';

export const screenWidth = Math.round(Dimensions.get('window').width);
export const screenHeight = Math.round(Dimensions.get('window').height);

export const purp = '#613F75';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 36,
    marginBottom: 20,
    alignSelf: 'center',
    color: 'black',
  },
  label: {
    fontSize: 16,
  },
  bigLabel: {
    fontWeight: 'bold',
    fontSize: 18,
    marginVertical: 10,
    color: 'black',
  },
  biggerLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 10,
    color: 'black',
  },
  input: {
    marginVertical: 7,
    marginHorizontal: 15,
    fontSize: 16,
    borderBottomColor: purp,
    borderBottomWidth: 1,
    height: screenHeight / 20,
    width: (screenWidth * 3) / 4,
    fontSize: 16,
  },
  outlinedInput: {
    backgroundColor: '#fff',
    margin: 5,
    borderColor: purp,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    zIndex: -1,
    fontSize: 16,
  },
  button: {
    textAlign: 'center',
    backgroundColor: purp,
    color: 'white',
    padding: 10,
    fontSize: 18,
    borderRadius: 10,
    marginVertical: 10,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  img: {
    width: screenWidth / 4,
    height: screenHeight / 8,
    alignSelf: 'center',
    marginBottom: 8,
    borderRadius: 13,
    resizeMode: 'contain'
  },
  dropdownLabel: {
    zIndex: 10,
  },
  bannerSuccess: {
    width: '100%',
    backgroundColor: '#D4EFA9',
  },
  definition: {
    color: '#a3a3a3',
    fontSize: 14,
  },
  term: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    alignSelf: 'center',
  },
  notFound: {
    fontSize: 18,
    margin: 5,
  },
  profileInfo: {
    backgroundColor: purp,
    height: screenHeight / 4,
    padding: 20,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#fff',
  },
  stats: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
});
