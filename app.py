import streamlit as st
from ai_advisor import ai_advisor
st.set_page_config(
    page_title="AFAQ AI",
    page_icon="🚀",
    layout="wide"
)

st.markdown("""
<style>
.stApp {
    background: #0b1220;
    color: white;
}
h1, h2, h3 {
    color: #38bdf8;
}
</style>
""", unsafe_allow_html=True)

st.title("🚀 آفاق AI | AFAQ AI")

st.subheader("نحوّل طموح الطلاب إلى فرص حقيقية")

st.write("منصتك الذكية لاكتشاف الفرص التعليمية.")

menu = st.sidebar.radio(
    "القائمة الرئيسية",
    [
        "الرئيسية",
        "المستشار الذكي",
        "تحليل الأهلية",
        "البحث عن المنح",
        "التنبيهات"
    ]
)

if menu == "الرئيسية":
    st.header("مرحباً بك في آفاق AI")
    st.info("اكتشف مستقبلك التعليمي معنا.")
elif menu == "المستشار الذكي":
    ai_advisor()

elif menu == "تحليل الأهلية":
    st.header("🎓 تحليل أهلية الطالب")
    nationality = st.text_input("الجنسية")
    education = st.selectbox(
        "المرحلة الدراسية",
        ["ثانوي", "جامعي", "خريج"]
    )
    grade = st.number_input(
        "المعدل الدراسي",
        min_value=0.0,
        max_value=100.0
    )
    if st.button("تحليل"):
        st.write("تم تسجيل بياناتك.")
        st.write("الجنسية:", nationality)
        st.write("المرحلة:", education)
        st.write("المعدل:", grade)

elif menu == "البحث عن المنح":
    st.header("🔍 البحث عن المنح")
    country = st.text_input("الدولة المطلوبة")
    if st.button("بحث"):
        st.warning("سيتم ربط محرك البحث بمصادر المنح.")

elif menu == "التنبيهات":
    st.header("🔔 التنبيهات")
    st.info("ستظهر هنا تنبيهات الفرص الجديدة.")

st.sidebar.markdown("---")
st.sidebar.caption("AFAQ AI © 2026")