// Internationalization data
const translations = {
    uz: {
        title: "Life organizer",
        quote_default: "Bugun kichik bir qadam, ertaga katta yutuqqa olib personally keladi!",
        quote_streak: "Ajoyib! Siz {streak} kunlik seriyaga erishdingiz!",
        habits: "Odatchilar",
        add_habit: "Yangi Odatchi Qo'shish",
        habit_name: "Odatchi Nomi",
        save: "Saqlash",
        cancel: "Bekor qilish",
        no_habits: "Hozircha odatlar yo'q. Yangi odatchi qo'shing!",
        duplicate_habit: "Bu odatchi nomi allaqachon mavjud!",
        confirm_delete: "Ushbu odatchini o'chirishni xohlaysizmi?",
        mark_complete: "Bajarildi",
        streak: "Seriya: {streak} kun",
        success_rate: "Muvaffaqiyat darajasi: {rate}%",
        mood_tracker: "Kayfiyat Kuzatuvchisi",
        mood_today: "Bugungi kayfiyatingiz:",
        save_mood: "Kayfiyatni Saqlash",
        goals: "Maqsadlar",
        add_goal: "Yangi Maqsad Qo'shish",
        goal_name: "Maqsad Nomi",
        deadline: "Muddat",
        subtasks: "Kichik Vazifalar",
        no_goals: "Hozircha maqsadlar yo'q. Yangi maqsad qo'shing!",
        duplicate_goal: "Bu maqsad nomi allaqachon mavjud!",
        days_left: "Qolgan kunlar: {days}",
        progress: "Rivoj: {progress}%",
        weekly_reflection: "Haftalik Tahlil",
        reflection_prompt: "Bu hafta qanday o'tdi? Nimalarni muvaffaqiyatli bajardingiz?",
        footer: "© 2025 Odatchi va Hayot Tadbirkori. Barcha huquqlar himoyalangan."
    },
    ru: {
        title: "Трекер привычек и организатор жизни",
        quote_default: "Сегодня маленький шаг, завтра большой успех!",
        quote_streak: "Отлично! Вы достигли серии в {streak} дней!",
        habits: "Привычки",
        add_habit: "Добавить новую привычку",
        habit_name: "Название привычки",
        save: "Сохранить",
        cancel: "Отмена",
        no_habits: "Пока нет привычек. Добавьте новую привычку!",
        duplicate_habit: "Эта привычка уже существует!",
        confirm_delete: "Вы уверены, что хотите удалить эту привычку?",
        mark_complete: "Выполнено",
        streak: "Серия: {streak} дней",
        success_rate: "Уровень успеха: {rate}%",
        mood_tracker: "Трекер настроения",
        mood_today: "Ваше настроение сегодня:",
        save_mood: "Сохранить настроение",
        goals: "Цели",
        add_goal: "Добавить новую цель",
        goal_name: "Название цели",
        deadline: "Срок",
        subtasks: "Подзадачи",
        no_goals: "Пока нет целей. Добавьте новую цель!",
        duplicate_goal: "Эта цель уже существует!",
        days_left: "Осталось дней: {days}",
        progress: "Прогресс: {progress}%",
        weekly_reflection: "Еженедельный анализ",
        reflection_prompt: "Как прошла эта неделя? Что вы успешно выполнили?",
        footer: "© 2025 Трекер привычек и организатор жизни. Все права защищены."
    },
    en: {
        title: "Habit Tracker & Life Organizer",
        quote_default: "A small step today leads to big wins tomorrow!",
        quote_streak: "Great job! You've reached a {streak}-day streak!",
        habits: "Habits",
        add_habit: "Add New Habit",
        habit_name: "Habit Name",
        save: "Save",
        cancel: "Cancel",
        no_habits: "No habits yet. Add a new habit!",
        duplicate_habit: "This habit name already exists!",
        confirm_delete: "Are you sure you want to delete this habit?",
        mark_complete: "Mark Complete",
        streak: "Streak: {streak} days",
        success_rate: "Success Rate: {rate}%",
        mood_tracker: "Mood Tracker",
        mood_today: "Your mood today:",
        save_mood: "Save Mood",
        goals: "Goals",
        add_goal: "Add New Goal",
        goal_name: "Goal Name",
        deadline: "Deadline",
        subtasks: "Subtasks",
        no_goals: "No goals yet. Add a new goal!",
        duplicate_goal: "This goal name already exists!",
        days_left: "Days Left: {days}",
        progress: "Progress: {progress}%",
        weekly_reflection: "Weekly Reflection",
        reflection_prompt: "How did this week go? What did you accomplish successfully?",
        footer: "© 2025 Habit Tracker & Life Organizer. All rights reserved."
    }
};

// Function to update text content based on selected language
function updateLanguage(lang) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = translations[lang][key] || element.textContent;
    });
    document.querySelector('html').lang = lang;
    document.body.dataset.lang = lang;
    localStorage.setItem('lang', lang);
}

// Load saved or default language
function loadLanguage() {
    const savedLang = localStorage.getItem('lang') || 'uz';
    document.getElementById('language-select').value = savedLang;
    updateLanguage(savedLang);
}
