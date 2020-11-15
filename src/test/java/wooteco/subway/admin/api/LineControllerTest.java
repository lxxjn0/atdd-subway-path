package wooteco.subway.admin.api;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import wooteco.subway.admin.config.ETagHeaderFilter;
import wooteco.subway.admin.controller.LineController;
import wooteco.subway.admin.domain.Line;
import wooteco.subway.admin.domain.Station;
import wooteco.subway.admin.dto.LineDetailResponse;
import wooteco.subway.admin.dto.WholeSubwayResponse;
import wooteco.subway.admin.service.LineService;

@WebMvcTest(controllers = {LineController.class})
@Import(ETagHeaderFilter.class)
public class LineControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private LineService lineService;

    @Test
    void ETag() throws Exception {
        WholeSubwayResponse response = new WholeSubwayResponse(
            Arrays.asList(createMockResponse(), createMockResponse()));
        given(lineService.wholeLines()).willReturn(response);

        // TODO: 전체 지하철 노선도 정보를 조회하는 URI 입력하기
        String uri = "";

        MvcResult mvcResult = mockMvc.perform(get(uri))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(header().exists("ETag"))
            .andReturn();

        String eTag = mvcResult.getResponse().getHeader("ETag");

        mockMvc.perform(get(uri).header("If-None-Match", eTag))
                .andDo(print())
                .andExpect(status().isNotModified())
                .andExpect(header().exists("ETag"))
                .andReturn();
    }

    private LineDetailResponse createMockResponse() {
        List<Station> stations = Arrays.asList(new Station(), new Station(), new Station());
        return LineDetailResponse.of(new Line(), stations);
    }
}
