"""Generate resume.pdf for portfolio download links."""

from pathlib import Path

from fpdf import FPDF

OUTPUT_PATH = Path(__file__).resolve().parent / "assets" / "resume.pdf"


class ResumePDF(FPDF):
    def section_title(self, title: str) -> None:
        self.set_x(self.l_margin)
        self.set_font("Helvetica", "B", 12)
        self.set_text_color(10, 36, 114)
        self.cell(0, 8, title, new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(37, 99, 235)
        y = self.get_y()
        self.line(self.l_margin, y, self.w - self.r_margin, y)
        self.ln(4)

    def body_text(self, text: str) -> None:
        self.set_x(self.l_margin)
        self.set_font("Helvetica", "", 10)
        self.set_text_color(40, 40, 40)
        self.multi_cell(self.epw, 5, text)
        self.ln(2)

    def bullet(self, text: str) -> None:
        self.set_x(self.l_margin)
        self.set_font("Helvetica", "", 10)
        self.set_text_color(40, 40, 40)
        self.multi_cell(self.epw, 5, f"- {text}")


def build_resume() -> None:
    pdf = ResumePDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()

    # Header
    pdf.set_font("Helvetica", "B", 22)
    pdf.set_text_color(10, 36, 114)
    pdf.cell(
    0, 6,
    "GitHub: https://github.com/Aparna857 | LinkedIn: https://www.linkedin.com/in/aparna-bommana/",
    new_x="LMARGIN",
    new_y="NEXT",
    align="C"
)

    pdf.set_font("Helvetica", "", 11)
    pdf.set_text_color(60, 60, 60)
    pdf.cell(0, 6, "Software Engineer | AI Enthusiast | Lifelong Learner", new_x="LMARGIN", new_y="NEXT", align="C")
    pdf.cell(0, 6, "syamalaaparna04@gmail.com | +91 7780641857 | Visakhapatnam, AP, India", new_x="LMARGIN", new_y="NEXT", align="C")
    pdf.cell(0, 6, "GitHub: github.com/Aparna857 | LinkedIn: linkedin.com/in/aparna-bommana/", new_x="LMARGIN", new_y="NEXT", align="C")
    pdf.ln(6)

    pdf.section_title("SUMMARY")
    pdf.body_text(
        "Fresher Software Engineer with expertise in Java, Spring, and AI fundamentals. "
        "Passionate about building scalable applications, java and Ai development, and continuous learning."
    )

    pdf.section_title("EDUCATION")
    pdf.body_text(
        "B.Tech Computer Science - Gayatri Vidya Parishad College of Engineering for Women (2022-2026) | CGPA: 8.26"
    )

    pdf.section_title("SKILLS")
    pdf.bullet("Programming Languages: Java, Spring, Basics of Python.")
    pdf.bullet("Web Development Skills: HTML, CSS, JavaScript, React js.")
    pdf.bullet("Data Base: SQL.")
    pdf.bullet("Core: Software Development Life Cycle, OOPs Concepts, AI Concepts, Basics of DSA.")
    pdf.bullet("AI Technologies & Tools: RAGs, LLMs, GPT, VS Code, Cursor, Power BI, GitHub, MS Office.")
    pdf.bullet("Soft Skills: Team Work, Problem Solving, Project Management, Good Communication, Adaptability.")
    pdf.ln(2)

    pdf.section_title("PROJECTS")
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(10, 36, 114)
    pdf.cell(0, 5, "AI TaskFlow", new_x="LMARGIN", new_y="NEXT")
    pdf.body_text(
        "Designed an AI-driven system that converts goals into structured weekly and daily task plans. "
        "Built with React, Node.js, FastAPI, MongoDB, LangChain, and Gemini AI. "
        "Implemented JWT authentication and role-based access control."
    )

    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(10, 36, 114)
    pdf.cell(
    0, 6,
    "GitHub: https://github.com/Aparna857",
    new_x="LMARGIN",
    new_y="NEXT",
    align="C"
)

pdf.cell(
    0, 6,
    "LinkedIn: https://www.linkedin.com/in/aparna-bommana/",
    new_x="LMARGIN",
    new_y="NEXT",
    align="C"
)
    pdf.body_text(
        "Web-based adaptive quiz system using Python, Flask, HTML, CSS, and JavaScript with dynamic "
        "difficulty adjustment and progress tracking."
    )

    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(10, 36, 114)
    pdf.cell(0, 5, "Bank Management System", new_x="LMARGIN", new_y="NEXT")
    pdf.body_text(
        "Full-stack application using React, Spring Boot, and MySQL for account creation, deposits, "
        "withdrawals, and secure REST API integration."
    )

    pdf.section_title("INTERNSHIPS & CERTIFICATIONS")
    pdf.bullet("Full Stack Java development under Wipro.")
    pdf.bullet("Web development Certification under EXCELR.")
    pdf.bullet("Artificial Intelligence and Machine Learning Certification under ELEWAYTE pvt. Limited.")
    pdf.bullet("Software programmer - python certification under CSC.")

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    pdf.output(str(OUTPUT_PATH))


if __name__ == "__main__":
    build_resume()
    print(f"Created {OUTPUT_PATH}")
