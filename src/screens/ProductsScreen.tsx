import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  SafeAreaView,
  TextInput,
  Modal,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import ProductDetailScreen from './ProductDetailScreen';

interface ProductsScreenProps {
  onGoBack: () => void;
}

// Icono de búsqueda
const SearchIcon = ({ color = '#666666', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

// Icono de ordenar
const SortIcon = ({ color = '#666666', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M3 6h18M7 12h10m-7 6h4" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

// Icono de flecha derecha
const ArrowRightIcon = ({ color = '#666666', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M9 18l6-6-6-6" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

// Icono de más (plus)
const PlusIcon = ({ color = '#FFFFFF', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M12 5v14m-7-7h14" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const ProductsScreen: React.FC<ProductsScreenProps> = ({
  onGoBack,
}) => {
  const [searchText, setSearchText] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductDetail, setShowProductDetail] = useState(false);

  const products = [
    {
      id: 1,
      name: 'Absolut Repair oil 10 en 1 - 90ml',
      price: '$655.00',
      category: 'Serum',
      code: '3474636977369',
      stock: 7,
      brand: "L'Oreal",
      description: 'https://oblok.s3.amazonaws.com/editor_assets/attachments/original/76629/418sdtnp7xLac_uf1000_1000_ql80.jpg'
    },
    {
      id: 2,
      name: 'Aceite invisible oil for all 10en1 - 100ml',
      price: '$750.00',
      category: 'Tratamiento',
      code: '3474636875432',
      stock: 5,
      brand: "L'Oreal",
      description: 'Tratamiento nutritivo para todo tipo de cabello con aceites esenciales'
    },
    {
      id: 3,
      name: 'all soft mega conditioner 3x400ml',
      price: '$630.00',
      category: 'Acondicionador',
      code: '3474636123456',
      stock: 12,
      brand: 'Matrix',
      description: 'Acondicionador ultra hidratante para cabello seco y dañado'
    }
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchText.toLowerCase()) ||
    product.category.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleProductPress = (product: any) => {
    console.log('Producto seleccionado:', product);
    setSelectedProduct(product);
    setShowProductDetail(true);
  };

  const handleProductDetailBack = () => {
    setShowProductDetail(false);
    setSelectedProduct(null);
  };

  const handleAddProduct = () => {
    console.log('Agregando nuevo producto');
    // Aquí puedes agregar la lógica para agregar un nuevo producto
  };

  const clearSearch = () => {
    setSearchText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Productos</Text>
        <TouchableOpacity style={styles.sortButton}>
          <SortIcon color="#333333" size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Barra de búsqueda */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <SearchIcon color="#666666" size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por nombre, código de barras..."
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#999999"
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>×</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Lista de productos */}
        <ScrollView style={styles.productsList} showsVerticalScrollIndicator={false}>
          {filteredProducts.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={styles.productCard}
              onPress={() => handleProductPress(product)}
            >
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>
                  {product.name.length > 35 ? product.name.substring(0, 35) + '...' : product.name}
                </Text>
                <Text style={styles.productPrice}>{product.price}</Text>
                <Text style={styles.productCategory}>{product.category}</Text>
              </View>
              <ArrowRightIcon color="#666666" size={16} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Botón flotante para agregar producto */}
      <TouchableOpacity style={styles.floatingButton} onPress={handleAddProduct}>
        <PlusIcon color="#FFFFFF" size={24} />
      </TouchableOpacity>

      {/* Modal para detalle del producto */}
      {selectedProduct && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={showProductDetail}
          onRequestClose={handleProductDetailBack}
        >
          <ProductDetailScreen
            product={selectedProduct}
            onGoBack={handleProductDetailBack}
          />
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    paddingRight: 16,
  },
  backButtonText: {
    fontSize: 24,
    color: '#333333',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
  },
  sortButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchContainer: {
    paddingVertical: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333333',
  },
  clearButton: {
    padding: 4,
  },
  clearButtonText: {
    fontSize: 18,
    color: '#666666',
    fontWeight: 'bold',
  },
  productsList: {
    flex: 1,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 2,
  },
  productCategory: {
    fontSize: 12,
    color: '#666666',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2C3E50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
});

export default ProductsScreen;
