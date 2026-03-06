class NormalizationService:
    def normalize_property_type(self, raw_type: str) -> str:
        # TODO: Implement rules
        return raw_type

    def normalize_gender(self, raw_gender: str) -> str:
        # TODO: Implement rules
        return raw_gender

    def normalize_boolean(self, value: str) -> bool:
        # TODO: Implement rules
        return False

normalization_service = NormalizationService()
