import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'

export default function Component() {
  return (
    <SafeAreaView className="flex-1 bg-[#1a1b29]">
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity>
            <Ionicons name="menu" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="search" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <Text className="text-white text-lg font-medium">Movies</Text>
        <TouchableOpacity>
          <Image 
            source={{ uri: "/placeholder.svg?height=32&width=32" }}
            className="w-8 h-8 rounded-full"
          />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {/* Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="px-4 py-3"
        >
          {['New Release', 'Popular', 'Action', 'Watch List'].map((category) => (
            <TouchableOpacity
              key={category}
              className="mr-4"
            >
              <Text className={`text-sm ${category === 'New Release' ? 'text-purple-500' : 'text-gray-400'}`}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* New Releases Grid */}
        <View className="px-4 mb-6">
          <View className="flex-row flex-wrap justify-between">
            <View className="w-[48%] mb-4">
              <Image
                source={{ uri: "/placeholder.svg?height=200&width=150" }}
                className="w-full h-48 rounded-lg mb-2"
              />
              <Text className="text-white text-sm">No Time to Die</Text>
              <Text className="text-gray-400 text-xs">2021 Movie</Text>
            </View>
            <View className="w-[48%] mb-4">
              <Image
                source={{ uri: "/placeholder.svg?height=200&width=150" }}
                className="w-full h-48 rounded-lg mb-2"
              />
              <Text className="text-white text-sm">Joker</Text>
              <Text className="text-gray-400 text-xs">2019 Movie</Text>
            </View>
          </View>
        </View>

        {/* Top Rated Movies */}
        <View className="px-4">
          <Text className="text-white text-lg mb-4">Top Rated Movies</Text>
          <View className="flex-row flex-wrap justify-between">
            <View className="w-[48%] mb-4">
              <Image
                source={{ uri: "/placeholder.svg?height=200&width=150" }}
                className="w-full h-48 rounded-lg mb-2"
              />
              <Text className="text-white text-sm">Spider-Man: Far From Home</Text>
            </View>
            <View className="w-[48%] mb-4">
              <Image
                source={{ uri: "/placeholder.svg?height=200&width=150" }}
                className="w-full h-48 rounded-lg mb-2"
              />
              <Text className="text-white text-sm">Shang-Chi</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="flex-row justify-between items-center px-12 py-4 bg-[#252634]">
        <TouchableOpacity>
          <Ionicons name="home" size={24} color="#E83A66" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={24} color="#6B6B6B" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="play-circle-outline" size={24} color="#6B6B6B" />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialIcons name="menu" size={24} color="#6B6B6B" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}