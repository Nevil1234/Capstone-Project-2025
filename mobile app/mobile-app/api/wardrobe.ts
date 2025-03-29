import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import Colors from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import wardrobe from '@/app/(tabs)/wardrobe';

interface WardrobeItem {
  id: string;
  name: string;
  brand: string;
  image: string;
  conditionScore: string;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: Colors.BLUE,
  },
  headerTitle: {
    fontSize: 24,
    color: Colors.WHITE,
    fontFamily: 'outfit-bold',
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: Colors.LIGHT_GRAY, // Fallback background color
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'outfit-bold',
    color: Colors.DARK,
  },
  itemBrand: {
    fontSize: 14,
    fontFamily: 'outfit-regular',
    color: Colors.DARK_GRAY,
  },
  conditionScore: {
    fontSize: 14,
    fontFamily: 'outfit-medium',
    color: Colors.BLUE,
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'outfit-medium',
    color: Colors.DARK_GRAY,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'outfit-medium',
    color: Colors.BLUE,
    textAlign: 'center',
    margin: 20,
  },
});

export default function WardrobeScreen() {


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: Colors.BLUE,
  },
  headerTitle: {
    fontSize: 24,
    color: Colors.WHITE,
    fontFamily: 'outfit-bold',
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: Colors.LIGHT_GRAY, // Fallback background color
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'outfit-bold',
    color: Colors.DARK,
  },
  itemBrand: {
    fontSize: 14,
    fontFamily: 'outfit-regular',
    color: Colors.DARK_GRAY,
  },
  conditionScore: {
    fontSize: 14,
    fontFamily: 'outfit-medium',
    color: Colors.BLUE,
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'outfit-medium',
    color: Colors.DARK_GRAY,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'outfit-medium',
    color: Colors.BLUE,
    textAlign: 'center',
    margin: 20,
  },
});