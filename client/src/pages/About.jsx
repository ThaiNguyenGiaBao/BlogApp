function About() {
  return (
    <div className="min-h-screen w-4/5 md:w-3/4 mx-auto">
      <div class="text-center mt-10">
        <h1 class="text-3xl font-bold mb-5">
          Hi there 👋, I'm Thai Nguyen Gia Bao
        </h1>
        <p class="text-xl">
          I am a second-year <strong>Computer Science</strong> student from Ho
          Chi Minh University of Technology (HCMUT)
        </p>
      </div>
      {/* <img
        src="bao.jpg"
        className="w-full mt-10 rounded-md  object-cover object-top z-20"
      /> */}
      <div class="my-10">
        <h2 class="text-2xl font-bold mb-5">About Me</h2>
        <ul class="list-disc pl-5 space-y-2">
          <li>
            Eager to learn everything in the vast field of computer science!
          </li>
          <li>
            Passionate about building innovative web applications and exploring
            the depths of neural networks.
          </li>
          <li>
            Strengths:
            <ul class="list-disc pl-5">
              <li>
                Have a solid foundation in theoretical knowledge in Computer
                Science
              </li>
              <li>
                Proficient in calculus (especially in integral) and physics
              </li>
            </ul>
          </li>
          <li>
            Fun Fact: I deeply appreciate drawing and enjoy delving into
            low-level programming.
          </li>
        </ul>
      </div>

      <div class="my-10">
        <h2 class="text-2xl font-bold mb-5">Goals</h2>
        <ul class="list-disc pl-5 space-y-2">
          <li>
            Continuously expand my knowledge and skills in computer science.
          </li>
          <li>
            Develop cutting-edge web applications and neural network models.
          </li>
          <li>Apply theoretical knowledge to solve real-world problems.</li>
        </ul>
      </div>
    </div>
  );
}

export default About;
