import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface ProductDetailScreenProps {
  onGoBack: () => void;
  product: {
    id: number;
    name: string;
    price: string;
    category: string;
    code?: string;
    stock?: number;
    brand?: string;
    description?: string;
  };
}

// Icono de editar
const EditIcon = ({ color = '#666666', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Path 
      d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

// Icono de imagen placeholder
const ImageIcon = ({ color = '#999999', size = 48 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Path 
      d="M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Path 
      d="m21 15-5-5L5 21" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  onGoBack,
  product,
}) => {
  // Datos por defecto basados en la imagen
  const productDetails = {
    existencias: product.stock || 7,
    precioBruto: product.price || '$655.00',
    precioDescuento: '$0.00',
    precioCompra: '$388.79',
    tipo: 'Variable',
    marca: product.brand || "L'Oreal",
    stockMinimo: 0,
    categoria: product.category || 'Serum',
    codigo: product.code || '3474636977369',
    descripcion: product.description || 'https://oblok.s3.amazonaws.com/editor_assets/attachments/original/76629/418sdtnp7xLac_uf1000_1000_ql80.jpg'
  };

  const handleEdit = () => {
    console.log('Editando producto:', product);
    // Aquí puedes agregar la lógica para editar el producto
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {product.name}
        </Text>
        <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
          <EditIcon color="#333333" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
        bounces={true}
        scrollEnabled={true}
      >
        {/* Imagen del producto */}
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder}>
            <ImageIcon color="#999999" size={48} />
          </View>
        </View>

        {/* Información principal */}
        <View style={styles.mainInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productCode}>{productDetails.codigo}</Text>
        </View>

        {/* Detalles */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Detalles</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Existencias:</Text>
            <Text style={styles.detailValue}>{productDetails.existencias}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Precio bruto:</Text>
            <Text style={styles.detailValue}>{productDetails.precioBruto}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Precio descuento:</Text>
            <Text style={styles.detailValue}>{productDetails.precioDescuento}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Precio compra:</Text>
            <Text style={styles.detailValue}>{productDetails.precioCompra}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Tipo:</Text>
            <Text style={styles.detailValue}>{productDetails.tipo}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Marca:</Text>
            <Text style={styles.detailValue}>{productDetails.marca}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Stock mínimo:</Text>
            <Text style={styles.detailValue}>{productDetails.stockMinimo}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Categoría(s):</Text>
            <Text style={styles.detailValue}>{productDetails.categoria}</Text>
          </View>
        </View>

        {/* Descripción */}
        <View style={styles.descriptionCard}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.descriptionText}>{productDetails.descripcion}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
    marginRight: 16,
  },
  editButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 50,
    flexGrow: 1,
  },
  imageContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },
  productCode: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  descriptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  detailLabel: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
    textAlign: 'right',
  },
  descriptionText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
});

export default ProductDetailScreen;
