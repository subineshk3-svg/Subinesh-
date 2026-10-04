class PromptEnhancer:
    @staticmethod
    def enhance(user_prompt: str, mode: str = "cinematic") -> str:
        if not user_prompt or len(user_prompt.strip()) == 0:
            return user_prompt

        clean_prompt = user_prompt.strip().rstrip(".")

        cinematic_enhancements = [
            "highly detailed cinematic composition",
            "photorealistic motion lighting",
            "volumetric atmospheric depth",
            "8k resolution motion capture",
            "dynamic camera tracking shot",
            "shallow depth of field",
        ]

        enhanced = f"{clean_prompt}, {', '.join(cinematic_enhancements)}."
        return enhanced

prompt_enhancer = PromptEnhancer()
