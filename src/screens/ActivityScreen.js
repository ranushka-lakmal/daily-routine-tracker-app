import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList,
  TextInput, Modal, Alert, ImageBackground, Platform, ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import {
  initDB,
  getAllActivities, saveActivity, updateActivity, deleteActivity,
  getAllCategories, saveCategory, updateCategory, deleteCategory,
} from '../db/sqlite';

export default function ActivityScreen() {
  const [tab, setTab] = useState('activities'); // 'activities' | 'categories'
  const [loading, setLoading] = useState(true);

  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);

  const [activityModal, setActivityModal] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  const [editing, setEditing] = useState(null); // {type:'activity'|'category', id:number}

  const [formActivity, setFormActivity] = useState(emptyActivity());
  const [formCategory, setFormCategory] = useState(emptyCategory());

  const [showDate, setShowDate] = useState(false);
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);

  useEffect(() => {
    (async () => {
      await initDB();
      await ensureDefaultCategories();
      await loadAll();
    })();
  }, []);

  function emptyActivity() {
    return {
      name: '',
      date: '',
      startTime: '',
      endTime: '',
      status: 'Pending',
      category: '',
      priority: '',
      notes: '',
    };
  }

  function emptyCategory() {
    return { name: '', priority: 'Medium', notes: '' };
  }

  async function ensureDefaultCategories() {
    const current = await getAllCategories();
    if (current.length === 0) {
      await saveCategory({ name: 'Work', priority: 'High', notes: '' });
      await saveCategory({ name: 'Exercise', priority: 'Medium', notes: '' });
      await saveCategory({ name: 'Study', priority: 'Low', notes: '' });
    }
  }

  async function loadAll() {
    try {
      setLoading(true);
      const [acts, cats] = await Promise.all([getAllActivities(), getAllCategories()]);
      setActivities(acts);
      setCategories(cats);
    } catch (e) {
      console.error('loadAll error', e);
      Alert.alert('Error', 'Failed to load local data.');
    } finally {
      setLoading(false);
    }
  }

  async function onSaveActivity() {
    if (!formActivity.name.trim() || !formActivity.date) {
      Alert.alert('Validation', 'Activity Name and Date are required.');
      return;
    }
    try {
      if (editing?.type === 'activity') {
        await updateActivity(editing.id, formActivity);
      } else {
        await saveActivity(formActivity);
      }
      await loadAll();
      setFormActivity(emptyActivity());
      setEditing(null);
      setActivityModal(false);
    } catch (e) {
      console.error('onSaveActivity error', e);
      Alert.alert('Error', 'Failed to save activity.');
    }
  }

  function onEditActivity(item) {
    setEditing({ type: 'activity', id: item.id });
    setFormActivity({
      name: item.name,
      date: item.date,
      startTime: item.startTime || '',
      endTime: item.endTime || '',
      status: item.status || 'Pending',
      category: item.category || '',
      priority: item.priority || '',
      notes: item.notes || '',
    });
    setActivityModal(true);
  }

  async function onDeleteActivity(id) {
    Alert.alert('Confirm', 'Delete this activity?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          await deleteActivity(id);
          await loadAll();
        }
      },
    ]);
  }


  async function onSaveCategory() {
    if (!formCategory.name.trim()) {
      Alert.alert('Validation', 'Category name is required.');
      return;
    }
    try {
      if (editing?.type === 'category') {
        await updateCategory(editing.id, formCategory);
      } else {
        await saveCategory(formCategory);
      }
      await loadAll();
      setFormCategory(emptyCategory());
      setEditing(null);
      setCategoryModal(false);
    } catch (e) {
      console.error('onSaveCategory error', e);
      Alert.alert('Error', 'Failed to save category.');
    }
  }

  function onEditCategory(item) {
    setEditing({ type: 'category', id: item.id });
    setFormCategory({
      name: item.name,
      priority: item.priority || 'Medium',
      notes: item.notes || '',
    });
    setCategoryModal(true);
  }

  async function onDeleteCategory(id) {
    Alert.alert('Confirm', 'Delete this category?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          await deleteCategory(id);
          await loadAll();
        }
      },
    ]);
  }


  const onDateChange = (_, d) => {
    setShowDate(false);
    if (d) setFormActivity(a => ({ ...a, date: d.toISOString().split('T')[0] }));
  };
  const onTimeChange = (field) => (_, t) => {
    if (Platform.OS === 'android') {
      field === 'startTime' ? setShowStart(false) : setShowEnd(false);
    }
    if (t) {
      const hh = String(t.getHours()).padStart(2, '0');
      const mm = String(t.getMinutes()).padStart(2, '0');
      setFormActivity(a => ({ ...a, [field]: `${hh}:${mm}` }));
    }
  };


  const ActivityItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardSubtitle}>
          {item.date} • {item.startTime || '--'} - {item.endTime || '--'}
        </Text>
        <Text style={styles.cardSubtitle}>
          {item.category || 'No category'} • {item.priority || 'N/A'} • {item.status || 'Pending'}
        </Text>
      </View>
      <View style={styles.cardButtons}>
        <TouchableOpacity onPress={() => onEditActivity(item)}>
          <Ionicons name="create-outline" size={22} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDeleteActivity(item.id)}>
          <Ionicons name="trash-outline" size={22} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const CategoryItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardSubtitle}>Priority: {item.priority}</Text>
        {item.notes ? <Text style={styles.cardSubtitle}>Notes: {item.notes}</Text> : null}
      </View>
      <View style={styles.cardButtons}>
        <TouchableOpacity onPress={() => onEditCategory(item)}>
          <Ionicons name="create-outline" size={22} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDeleteCategory(item.id)}>
          <Ionicons name="trash-outline" size={22} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ImageBackground source={require('../../assets/login-bg.png')} style={styles.container} resizeMode="cover">
    
      <View style={styles.tabContainer}>
        {['activities', 'categories'].map((key) => (
          <TouchableOpacity
            key={key}
            style={[styles.tabButton, tab === key && styles.tabActive]}
            onPress={() => setTab(key)}
          >
            <Text style={[styles.tabText, tab === key && styles.tabTextActive]}>
              {key === 'activities' ? 'Activities' : 'Categories'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

    
      {tab === 'activities' ? (
        <>
          <TouchableOpacity
            style={styles.newCard}
            onPress={() => { setEditing(null); setFormActivity(emptyActivity()); setActivityModal(true); }}
          >
            <Ionicons name="add-circle" size={50} color="#007AFF" />
            <Text style={styles.newTitle}>Add New Activity</Text>
          </TouchableOpacity>

          <FlatList
            data={activities}
            keyExtractor={(it) => String(it.id)}
            renderItem={({ item }) => <ActivityItem item={item} />}
            ListEmptyComponent={<Text style={styles.emptyText}>No activities found.</Text>}
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        </>
      ) : (
        <>
          <TouchableOpacity
            style={styles.newCard}
            onPress={() => { setEditing(null); setFormCategory(emptyCategory()); setCategoryModal(true); }}
          >
            <Ionicons name="add-circle" size={50} color="#007AFF" />
            <Text style={styles.newTitle}>Add New Category</Text>
          </TouchableOpacity>

          <FlatList
            data={categories}
            keyExtractor={(it) => String(it.id)}
            renderItem={({ item }) => <CategoryItem item={item} />}
            ListEmptyComponent={<Text style={styles.emptyText}>No categories found.</Text>}
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        </>
      )}

    
      <Modal transparent visible={activityModal} animationType="slide" onRequestClose={() => setActivityModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{editing?.type === 'activity' ? 'Edit Activity' : 'Add Activity'}</Text>

            <TextInput
              placeholder="Activity Name"
              style={styles.input}
              value={formActivity.name}
              onChangeText={(t) => setFormActivity((a) => ({ ...a, name: t }))}
            />

            <TouchableOpacity style={styles.input} onPress={() => setShowDate(true)}>
              <Text>{formActivity.date || 'Select Date'}</Text>
            </TouchableOpacity>
            {showDate && (
              <DateTimePicker
                mode="date"
                value={formActivity.date ? new Date(formActivity.date) : new Date()}
                onChange={onDateChange}
              />
            )}

            <TouchableOpacity style={styles.input} onPress={() => setShowStart(true)}>
              <Text>{formActivity.startTime || 'Select Start Time'}</Text>
            </TouchableOpacity>
            {showStart && (
              <DateTimePicker mode="time" is24Hour value={new Date()} onChange={onTimeChange('startTime')} />
            )}

            <TouchableOpacity style={styles.input} onPress={() => setShowEnd(true)}>
              <Text>{formActivity.endTime || 'Select End Time'}</Text>
            </TouchableOpacity>
            {showEnd && (
              <DateTimePicker mode="time" is24Hour value={new Date()} onChange={onTimeChange('endTime')} />
            )}

            <Text style={styles.label}>Select Category</Text>
            <View style={styles.dropdown}>
              {categories.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={[styles.dropdownItem, formActivity.category === c.name && styles.dropdownSelected]}
                  onPress={() => setFormActivity((a) => ({ ...a, category: c.name, priority: c.priority }))}
                >
                  <Text style={{ color: formActivity.category === c.name ? '#fff' : '#007AFF' }}>{c.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              placeholder="Priority (auto from category)"
              style={[styles.input, { color: '#888' }]}
              value={formActivity.priority}
              editable={false}
            />

            <TextInput
              placeholder="Notes"
              style={[styles.input, { height: 80 }]}
              value={formActivity.notes}
              onChangeText={(t) => setFormActivity((a) => ({ ...a, notes: t }))}
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.saveBtn} onPress={onSaveActivity}>
                <Text style={styles.saveText}>{editing?.type === 'activity' ? 'Update' : 'Save'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.saveBtn, { backgroundColor: '#ccc' }]} onPress={() => setActivityModal(false)}>
                <Text style={[styles.saveText, { color: '#333' }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


      <Modal transparent visible={categoryModal} animationType="slide" onRequestClose={() => setCategoryModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{editing?.type === 'category' ? 'Edit Category' : 'Add Category'}</Text>

            <TextInput
              placeholder="Category Name"
              style={styles.input}
              value={formCategory.name}
              onChangeText={(t) => setFormCategory((c) => ({ ...c, name: t }))}
            />

            <Text style={styles.label}>Priority</Text>
            <View style={styles.dropdown}>
              {['High', 'Medium', 'Low'].map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[styles.dropdownItem, formCategory.priority === p && styles.dropdownSelected]}
                  onPress={() => setFormCategory((c) => ({ ...c, priority: p }))}
                >
                  <Text style={{ color: formCategory.priority === p ? '#fff' : '#007AFF' }}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              placeholder="Notes"
              style={[styles.input, { height: 80 }]}
              value={formCategory.notes}
              onChangeText={(t) => setFormCategory((c) => ({ ...c, notes: t }))}
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.saveBtn} onPress={onSaveCategory}>
                <Text style={styles.saveText}>{editing?.type === 'category' ? 'Update' : 'Save'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.saveBtn, { backgroundColor: '#ccc' }]} onPress={() => setCategoryModal(false)}>
                <Text style={[styles.saveText, { color: '#333' }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 60 },
  tabContainer: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 30, padding: 6 },
  tabButton: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 25 },
  tabActive: { backgroundColor: '#007AFF' },
  tabText: { color: '#000', fontWeight: '600', fontSize: 15 },
  tabTextActive: { color: '#fff' },
  newCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 20, marginTop: 20, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.08, shadowOffset: { width: 0, height: 4 }, shadowRadius: 5, elevation: 3,
  },
  newTitle: { fontSize: 17, fontWeight: '700', color: '#000', marginTop: 8 },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14,
    padding: 16, marginTop: 12, justifyContent: 'space-between',
    shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 3 }, shadowRadius: 4, elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#000' },
  cardSubtitle: { color: '#777', fontSize: 13 },
  cardButtons: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  modalContainer: { backgroundColor: '#fff', borderRadius: 20, width: '90%', padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 15, color: '#000' },
  input: {
    backgroundColor: '#f8f8f8', borderRadius: 10, padding: 12, borderColor: '#e0e0e0', borderWidth: 1, marginBottom: 10,
  },
  label: { fontWeight: '600', color: '#000', marginBottom: 5 },
  dropdown: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  dropdownItem: {
    paddingVertical: 8, paddingHorizontal: 15, borderRadius: 10, borderWidth: 1, borderColor: '#007AFF',
    marginRight: 8, marginBottom: 8,
  },
  dropdownSelected: { backgroundColor: '#007AFF' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  saveBtn: { flex: 1, marginHorizontal: 5, paddingVertical: 12, borderRadius: 10, backgroundColor: '#007AFF', alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
