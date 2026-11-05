import streamlit as st

def ai_advisor():

    st.title("🤖 مستشار آفاق الذكي")

    st.write(
        "مرحباً بك! أنا مستشارك التعليمي "
        "وسأساعدك في اكتشاف الفرص المناسبة."
    )

    if "messages" not in st.session_state:
        st.session_state.messages = []

    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.write(message["content"])

    question = st.chat_input("اسألني عن المنح والفرص التعليمية")

    if question:
        st.session_state.messages.append({
            "role": "user",
            "content": question
        })

        with st.chat_message("user"):
            st.write(question)

        answer = (
            "شكراً لسؤالك! أنا مستشار آفاق التعليمي. "
            "سيتم ربط نموذج الذكاء الاصطناعي الحقيقي "
            "في المرحلة القادمة حتى أقدم لك إجابات دقيقة."
        )

        with st.chat_message("assistant"):
            st.write(answer)

        st.session_state.messages.append({
            "role": "assistant",
            "content": answer
        })