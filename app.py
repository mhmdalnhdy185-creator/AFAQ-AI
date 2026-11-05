import streamlit as st
from ai_advisor import ai_advisor
from database import initialize_database, get_opportunities, add_student

st.set_page_config(
    page_title="AFAQ AI",
    page_icon="🚀",
    layout="wide"
)

# تهيئة قاعدة البيانات
initialize_database()

# تصميم الواجهة
st.title("🚀 آفاق AI")
st.subheader("منصتك الذكية لاكتشاف الفرص التعليمية")

st.divider()

# القائمة الرئيسية
st.sidebar.title("القائمة الرئيسية")

page = st.sidebar.radio(
    "اختر القسم",
    [
        "الرئيسية",
        "المستشار الذكي",
        "الفرص التعليمية",
        "تسجيل طالب"
    ]
)

# الصفحة الرئيسية
if page == "الرئيسية":

    st.header("مرحباً بك في آفاق AI")

    st.write(
        "اكتشف مستقبلك التعليمي من خلال منصة ذكية "
        "تجمع لك الفرص والمنح والبرامج التعليمية."
    )

    col1, col2, col3 = st.columns(3)

    col1.metric("المنح الدراسية", "قريباً")
    col2.metric("الهاكاثونات", "قريباً")
    col3.metric("الدورات التعليمية", "قريباً")

    st.divider()

    st.info("آفاق AI — فرصتك نحو مستقبل أفضل.")

# المستشار الذكي
elif page == "المستشار الذكي":

    st.header("🤖 المستشار الذكي")

    st.write("اسأل مستشارك الذكي عن مستقبلك التعليمي.")

    question = st.text_area("اكتب سؤالك هنا")

    if st.button("اسأل المستشار"):

        if question.strip():

            with st.spinner("جاري التفكير..."):

                try:
                    answer = ai_advisor(question)
                    st.success("إجابة المستشار:")
                    st.write(answer)

                except Exception as e:
                    st.error(f"حدث خطأ: {e}")

        else:
            st.warning("يرجى كتابة سؤالك أولاً.")

# الفرص التعليمية
elif page == "الفرص التعليمية":

    st.header("🎓 الفرص التعليمية")

    opportunities = get_opportunities()

    if opportunities:

        for item in opportunities:

            with st.container():

                st.subheader(item[1])
                st.write(item[2] or "")
                st.write(item[3] or "")

                if item[4]:
                    st.link_button(
                        "زيارة الفرصة",
                        item[4]
                    )

                st.divider()

    else:

        st.info("لا توجد فرص تعليمية مضافة حالياً.")

# تسجيل الطلاب
elif page == "تسجيل طالب":

    st.header("📝 تسجيل طالب جديد")

    name = st.text_input("الاسم الكامل")
    email = st.text_input("البريد الإلكتروني")
    country = st.text_input("الدولة")
    education = st.text_input("المستوى التعليمي")

    if st.button("تسجيل الطالب"):

        if name.strip():

            try:

                add_student(
                    name,
                    email or None,
                    country,
                    education
                )

                st.success("تم تسجيل الطالب بنجاح!")

            except Exception as e:

                st.error(f"حدث خطأ: {e}")

        else:

            st.warning("يرجى إدخال ال