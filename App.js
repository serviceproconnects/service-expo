import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, TextInput, ScrollView, TouchableOpacity, Switch, Alert } from "react-native";

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCjE7dKPWWXBgs453Z5i_lWpvr_Jap8h0c",
  authDomain: "service-platform-pro.firebaseapp.com",
  projectId: "service-platform-pro",
  storageBucket: "service-platform-pro.firebasestorage.app",
  messagingSenderId: "288035417062",
  appId: "1:288035417062:web:0016e6007a3e7126258427",
  measurementId: "G-2QJX4E8EEB"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Chip = ({ label }) => (
  <View style={{ paddingVertical: 8, paddingHorizontal: 12, borderRadius: 16, borderWidth: 1, marginRight: 8, marginBottom: 8 }}>
    <Text>{label}</Text>
  </View>
);

const ProCard = ({ name, subtitle }) => (
  <View style={{ borderWidth: 1, borderRadius: 16, padding: 14, marginBottom: 10 }}>
    <Text style={{ fontWeight: "700", fontSize: 16 }}>{name}  🏅 Verified</Text>
    <Text style={{ color: "#666", marginTop: 4 }}>{subtitle}</Text>
  </View>
);

export default function App() {
  const [tab, setTab] = useState("Home");
  const [dark, setDark] = useState(false);
  const [name, setName] = useState("");
  const [skill, setSkill] = useState("");
  const [pros, setPros] = useState([]);

  async function loadPros() {
    const q = query(collection(db, "professionals"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    setPros(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }

  async function addPro() {
    if (!name || !skill) return Alert.alert("Missing info", "Enter name and skill");
    await addDoc(collection(db, "professionals"), {
      name, skill, rating: 4.9, city: "Dar es Salaam",
      createdAt: Date.now(), verified: true
    });
    setName(""); setSkill("");
    await loadPros();
    Alert.alert("Saved", "Professional added ✅");
  }

  useEffect(() => { loadPros(); }, []);

  const Home = () => (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 10, color: dark ? "#EEE" : "#111" }}>
        Find verified professionals near you
      </Text>

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={{
          borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 10,
          backgroundColor: dark ? "#111" : "#fff", color: dark ? "#eee" : "#000",
          borderColor: dark ? "#333" : "#ccc"
        }}
        placeholderTextColor={dark ? "#777" : "#999"}
      />
      <TextInput
        placeholder="Skill (e.g., Plumber)"
        value={skill}
        onChangeText={setSkill}
        style={{
          borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 16,
          backgroundColor: dark ? "#111" : "#fff", color: dark ? "#eee" : "#000",
          borderColor: dark ? "#333" : "#ccc"
        }}
        placeholderTextColor={dark ? "#777" : "#999"}
      />
      <TouchableOpacity onPress={addPro} style={{ backgroundColor: "#0B2545", padding: 12, borderRadius: 10, marginBottom: 16 }}>
        <Text style={{ color: "white", textAlign: "center", fontWeight: "700" }}>Add Professional (test)</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {["Plumbing","Electrical","Carpentry","Cleaning","Logistics","Construction"].map(c => <Chip key={c} label={c} />)}
      </View>

      <Text style={{ fontSize: 18, fontWeight: "700", marginVertical: 12, color: dark ? "#EEE" : "#111" }}>Live from Firestore</Text>
      {pros.map(p => (
        <ProCard key={p.id} name={p.name} subtitle={`${p.skill} • ${p.city} • ⭐ ${p.rating}`} />
      ))}
    </ScrollView>
  );

  const Screen = () => (tab === "Home"
    ? <Home/>
    : <View style={{ flex:1, alignItems:"center", justifyContent:"center" }}>
        <Text style={{ color: dark ? "#eee" : "#000" }}>{tab}</Text>
      </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: dark ? "#0A0A0A" : "white" }}>
      <View style={{ padding: 16, alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 20, fontWeight: "800", color: dark ? "#EEE" : "#111" }}>Service</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ color: dark ? "#EEE" : "#111", marginRight: 6 }}>Dark</Text>
          <Switch value={dark} onValueChange={setDark} />
        </View>
      </View>
      <Screen />
      <View style={{ flexDirection: "row", justifyContent: "space-around", paddingVertical: 10, borderTopWidth: 1, borderColor: dark ? "#222" : "#ddd" }}>
        {["Home","Explore","Messages","Account"].map(t => (
          <TouchableOpacity key={t} onPress={() => setTab(t)}>
            <Text style={{ fontWeight: tab === t ? "800" : "400", color: dark ? "#EEE" : "#000" }}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}
